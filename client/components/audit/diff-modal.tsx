'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// Dynamic import for ReactDiffViewer to avoid SSR issues
const ReactDiffViewer = dynamic(() => import('react-diff-viewer-continued'), {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading diff viewer...</div>,
});

interface DiffModalProps {
    isOpen: boolean;
    onClose: () => void;
    oldValue: string;
    newValue: string;
    title?: string;
}

export function DiffModal({
    isOpen,
    onClose,
    oldValue,
    newValue,
    title = 'Changes',
}: DiffModalProps) {
    const { theme } = useTheme();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <ReactDiffViewer
                        oldValue={oldValue}
                        newValue={newValue}
                        splitView={true}
                        useDarkTheme={theme === 'dark'}
                        leftTitle="Old Value"
                        rightTitle="New Value"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
