import { getBOMsAction } from '@/app/actions/manufacturing-actions';
import { BOMClient } from './bom-client';

export default async function BOMPage() {
    const boms = await getBOMsAction();

    return <BOMClient boms={boms} />;
}

