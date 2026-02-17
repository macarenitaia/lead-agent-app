import { PipelineBoard } from '@/features/leads/components/PipelineBoard';

export const metadata = {
    title: 'Pipeline de Leads | Autonoma AI Agency',
    description: 'Gestión centralizada de leads de Web y WhatsApp',
};

export default function LeadsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <PipelineBoard />
        </div>
    );
}
