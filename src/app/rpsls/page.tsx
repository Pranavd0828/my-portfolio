import RpslsGame from '@/components/RpslsGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Duel Protocol | Pranav Deo',
    description: 'A structural, geometric interpretation of Rock Paper Scissors Lizard Spock.',
};

export default function RpslsPage() {
    return <RpslsGame />;
}
