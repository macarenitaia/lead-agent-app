'use client';

import React, { useEffect, useState } from 'react';
import { Lead, PipelineStage } from '../types';
import { leadsService } from '../services/leads-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

export function PipelineBoard() {
    const [stages, setStages] = useState<PipelineStage[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [stagesData, leadsData] = await Promise.all([
                    leadsService.getStages(),
                    leadsService.getLeads()
                ]);
                setStages(stagesData);
                setLeads(leadsData);
            } catch (error) {
                console.error('Error fetching pipeline data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-[600px] w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Pipeline de Ventas</h2>
                <Button>Nuevo Lead</Button>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4 items-start min-h-[70vh]">
                {stages.map((stage) => {
                    const stageLeads = leads.filter((lead) => lead.stage_id === stage.id);

                    return (
                        <div key={stage.id} className="flex-shrink-0 w-80 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg p-4 border flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    {stage.name}
                                </h3>
                                <Badge variant="secondary">{stageLeads.length}</Badge>
                            </div>

                            <div className="flex flex-col space-y-3">
                                {stageLeads.length === 0 ? (
                                    <div className="text-xs text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                                        Sin leads
                                    </div>
                                ) : (
                                    stageLeads.map((lead) => (
                                        <Card key={lead.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                            <CardHeader className="p-3 pb-0">
                                                <CardTitle className="text-sm font-medium leading-none">
                                                    {lead.full_name || 'Sin nombre'}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-2 flex flex-col space-y-2">
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <Badge variant={lead.source === 'whatsapp' ? 'outline' : 'default'} className="scale-90 origin-left uppercase">
                                                        {lead.source}
                                                    </Badge>
                                                    <div className="flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                        <span className="text-muted-foreground font-bold font-mono">
                                                            {lead.ai_score}
                                                        </span>
                                                    </div>
                                                </div>
                                                {lead.ai_intent && <p className="text-[10px] italic text-muted-foreground line-clamp-1">"{lead.ai_intent}"</p>}
                                                {lead.phone && <p className="text-[10px] text-muted-foreground">{lead.phone}</p>}
                                                <Button variant="ghost" size="sm" className="w-full text-[10px] h-7 mt-1 border border-amber-100 hover:bg-amber-50">
                                                    AI Insight
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
