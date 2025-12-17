// /app/api/check-permission/route.ts
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { accessControlService } from '@/lib/services/access-control-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return Response.json({ hasPermission: false }, { status: 401 });
    }

    const { resource, action } = await req.json();

    if (!resource || !action) {
      return Response.json({ error: 'Missing resource or action' }, { status: 400 });
    }

    const hasPermission = await accessControlService.hasPermission(
      session.user.id,
      resource,
      action
    );

    return Response.json({ hasPermission });
  } catch (error) {
    console.error('Error checking permission:', error);
    return Response.json({ hasPermission: false }, { status: 500 });
  }
}