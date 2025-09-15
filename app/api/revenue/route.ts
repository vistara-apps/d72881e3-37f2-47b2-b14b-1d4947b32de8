import { NextRequest, NextResponse } from 'next/server';

// Mock database - in real app, this would be a proper database
let revenueSplits: any[] = [];
let transactions: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    const creatorId = searchParams.get('creatorId');
    const splitId = searchParams.get('splitId');

    if (splitId) {
      // Get specific revenue split
      const split = revenueSplits.find(s => s.splitId === splitId);
      if (!split) {
        return NextResponse.json({ error: 'Revenue split not found' }, { status: 404 });
      }
      return NextResponse.json(split);
    }

    if (contentId) {
      // Get revenue splits for content
      const contentSplits = revenueSplits.filter(s => s.contentId === contentId);
      return NextResponse.json(contentSplits);
    }

    if (creatorId) {
      // Get revenue data for creator
      const creatorSplits = revenueSplits.filter(s => s.creatorId === creatorId);
      const creatorTransactions = transactions.filter(t => t.creatorId === creatorId);

      const totalRevenue = creatorTransactions.reduce((sum, t) => sum + t.amount, 0);
      const pendingRevenue = creatorTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

      return NextResponse.json({
        splits: creatorSplits,
        transactions: creatorTransactions,
        summary: {
          totalRevenue,
          pendingRevenue,
          claimedRevenue: totalRevenue - pendingRevenue
        }
      });
    }

    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'split') {
      // Create revenue split
      const { splitId, contentId, creatorId, recipients, percentages } = data;

      if (!splitId || !contentId || !creatorId || !recipients || !percentages) {
        return NextResponse.json(
          { error: 'Missing required fields for revenue split' },
          { status: 400 }
        );
      }

      // Validate percentages sum to 100%
      const totalPercentage = percentages.reduce((sum: number, p: number) => sum + p, 0);
      if (totalPercentage !== 10000) { // 100% in basis points
        return NextResponse.json(
          { error: 'Percentages must sum to 100%' },
          { status: 400 }
        );
      }

      const newSplit = {
        splitId,
        contentId,
        creatorId,
        recipients,
        percentages,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      revenueSplits.push(newSplit);
      return NextResponse.json(newSplit, { status: 201 });

    } else if (type === 'transaction') {
      // Record revenue transaction
      const { contentId, splitId, payer, amount, tokenAddress } = data;

      if (!contentId || !splitId || !payer || !amount) {
        return NextResponse.json(
          { error: 'Missing required fields for transaction' },
          { status: 400 }
        );
      }

      // Find the revenue split
      const split = revenueSplits.find(s => s.splitId === splitId && s.isActive);
      if (!split) {
        return NextResponse.json(
          { error: 'Active revenue split not found' },
          { status: 404 }
        );
      }

      // Calculate distributions
      const distributions = split.recipients.map((recipient: string, index: number) => ({
        recipient,
        amount: (amount * split.percentages[index]) / 10000,
        percentage: split.percentages[index]
      }));

      const newTransaction = {
        transactionId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        contentId,
        splitId,
        payer,
        amount,
        tokenAddress: tokenAddress || '0x0000000000000000000000000000000000000000', // ETH
        distributions,
        status: 'pending', // pending, completed, failed
        createdAt: new Date().toISOString(),
        processedAt: null
      };

      transactions.push(newTransaction);

      // In a real app, this would trigger smart contract calls
      // For now, we'll simulate processing
      setTimeout(() => {
        const txIndex = transactions.findIndex(t => t.transactionId === newTransaction.transactionId);
        if (txIndex !== -1) {
          transactions[txIndex].status = 'completed';
          transactions[txIndex].processedAt = new Date().toISOString();
        }
      }, 5000); // Simulate 5 second processing time

      return NextResponse.json(newTransaction, { status: 201 });

    } else if (type === 'claim') {
      // Claim revenue
      const { creatorId, amount } = data;

      if (!creatorId || !amount) {
        return NextResponse.json(
          { error: 'Missing required fields for claim' },
          { status: 400 }
        );
      }

      // Find pending transactions for this creator
      const pendingTransactions = transactions.filter(
        t => t.distributions.some((d: any) => d.recipient === creatorId) && t.status === 'pending'
      );

      const totalPending = pendingTransactions.reduce((sum, t) => {
        const distribution = t.distributions.find((d: any) => d.recipient === creatorId);
        return sum + (distribution ? distribution.amount : 0);
      }, 0);

      if (totalPending < amount) {
        return NextResponse.json(
          { error: 'Insufficient pending balance' },
          { status: 400 }
        );
      }

      // Mark transactions as claimed
      pendingTransactions.forEach(t => {
        const distribution = t.distributions.find((d: any) => d.recipient === creatorId);
        if (distribution) {
          t.status = 'claimed';
          t.claimedAt = new Date().toISOString();
        }
      });

      const claimRecord = {
        claimId: `claim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        creatorId,
        amount,
        claimedAt: new Date().toISOString(),
        transactions: pendingTransactions.map(t => t.transactionId)
      };

      return NextResponse.json(claimRecord, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing revenue request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { splitId, isActive } = body;

    if (!splitId) {
      return NextResponse.json(
        { error: 'Split ID is required' },
        { status: 400 }
      );
    }

    const splitIndex = revenueSplits.findIndex(s => s.splitId === splitId);
    if (splitIndex === -1) {
      return NextResponse.json({ error: 'Revenue split not found' }, { status: 404 });
    }

    // Update split
    revenueSplits[splitIndex].isActive = isActive !== undefined ? isActive : revenueSplits[splitIndex].isActive;
    revenueSplits[splitIndex].updatedAt = new Date().toISOString();

    return NextResponse.json(revenueSplits[splitIndex]);
  } catch (error) {
    console.error('Error updating revenue split:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get revenue analytics
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const timeRange = searchParams.get('timeRange') || '30d';

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Filter transactions for creator within date range
    const creatorTransactions = transactions.filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate >= startDate && txDate <= now &&
             t.distributions.some((d: any) => d.recipient === creatorId);
    });

    // Calculate analytics
    const totalRevenue = creatorTransactions.reduce((sum, t) => {
      const distribution = t.distributions.find((d: any) => d.recipient === creatorId);
      return sum + (distribution ? distribution.amount : 0);
    }, 0);

    const completedTransactions = creatorTransactions.filter(t => t.status === 'completed');
    const pendingTransactions = creatorTransactions.filter(t => t.status === 'pending');

    const analytics = {
      timeRange,
      totalRevenue,
      transactionCount: creatorTransactions.length,
      completedCount: completedTransactions.length,
      pendingCount: pendingTransactions.length,
      averageTransaction: creatorTransactions.length > 0 ? totalRevenue / creatorTransactions.length : 0,
      recentTransactions: creatorTransactions.slice(-10).reverse() // Last 10 transactions
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

