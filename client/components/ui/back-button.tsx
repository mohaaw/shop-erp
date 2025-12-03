'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    label?: string;
    fallbackUrl?: string;
}

export function BackButton({ label = 'Back', fallbackUrl }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else if (fallbackUrl) {
            router.push(fallbackUrl);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
