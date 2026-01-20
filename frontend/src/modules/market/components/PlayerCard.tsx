import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface PublicPlayerCardData {
    id: string;
    fullName: string;
    photo: string;
    position: string;
    nationality: string;
    age: number;
    height: number;
    foot: string;
    contractStatus: string;
    agencyName: string;
}

interface PlayerCardProps {
    player: PublicPlayerCardData;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {

    const getBadgeStyles = (status: string) => {
        switch (status) {
            case 'Libre':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Prestamo':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Con Contrato':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border border-slate-200 rounded-xl hover:shadow-lg hover:-translate-y-1 bg-white">
            <div className="relative flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white">
                <div className="relative w-32 h-32 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-slate-200">
                    {player.photo ? (
                        <img
                            src={player.photo}
                            alt={player.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl font-bold">
                            {player.fullName.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold shadow-sm border text-slate-700">
                    {player.nationality || 'N/A'}
                </div>
            </div>

            <CardContent className="flex-1 px-5 pt-2 pb-4 text-center">
                <span className={`inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full border ${getBadgeStyles(player.contractStatus)}`}>
                    {player.contractStatus}
                </span>

                <h3 className="mb-1 text-xl font-bold text-slate-900 truncate" title={player.fullName}>
                    {player.fullName}
                </h3>

                <p className="mb-4 text-sm font-medium text-slate-500">
                    {player.position}  <span className="mx-1.5 text-slate-300">|</span>  {player.agencyName}
                </p>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-800">{player.age || '-'}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Edad</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-800">{player.height || '-'}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">CM</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-800 truncate">{player.foot || '-'}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Pie</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-6 pt-0">
                <Button
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md active:scale-95 transition-transform"
                    onClick={() => {
                        console.log('Contacting agent for player:', player.id);
                        window.location.href = `mailto:info@agentsport.com?subject=Interés en jugador: ${player.fullName} (${player.id})`;
                    }}
                >
                    Contactar Agente
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PlayerCard;
