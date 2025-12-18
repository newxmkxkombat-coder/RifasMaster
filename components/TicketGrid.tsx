
import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { RefreshCw, X } from 'lucide-react';

interface TicketGridProps {
  tickets: Ticket[];
  onToggleTicket: (id: string) => void;
  swappingTicketId?: string | null;
  isFullScreen?: boolean;
  activeOwnerName?: string | null;
}

const TicketGrid: React.FC<TicketGridProps> = ({ tickets, onToggleTicket, swappingTicketId, isFullScreen = false, activeOwnerName = null }) => {
  return (
    <div className={`
      grid transition-all duration-500 w-full mx-auto
      ${isFullScreen 
        ? 'grid-cols-10 gap-1.5 sm:gap-2 p-1.5 bg-slate-950 border border-slate-900 shadow-[0_0_50px_rgba(0,0,0,1)] max-w-[98vh]'
        : 'grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 p-5 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl'
      }
    `}>
      {tickets.map((ticket) => {
        const isSwappingSource = ticket.id === swappingTicketId;
        const belongsToActiveUser = activeOwnerName && ticket.ownerName === activeOwnerName;
        
        // Logical check for when to show the "X" (Any occupied state)
        const isOccupied = 
          ticket.status === TicketStatus.SELECTED || 
          ticket.status === TicketStatus.RESERVED || 
          ticket.status === TicketStatus.PAID;

        // An interactive ticket is one that is available to be clicked
        let isInteractive = ticket.status === TicketStatus.AVAILABLE || ticket.status === TicketStatus.SELECTED;
        
        if (swappingTicketId) {
            isInteractive = ticket.status === TicketStatus.AVAILABLE; 
        } else if (activeOwnerName) {
            isInteractive = ticket.status === TicketStatus.AVAILABLE || belongsToActiveUser;
        }

        return (
          <button
            type="button"
            key={ticket.id}
            onClick={() => isInteractive ? onToggleTicket(ticket.id) : null}
            disabled={!isInteractive && !isSwappingSource}
            className={`
              relative flex flex-col items-center justify-center font-black transition-all duration-300
              ${isFullScreen ? 'rounded-none' : 'rounded-xl'}
              ${isSwappingSource ? 'bg-indigo-900 border-indigo-400 text-white ring-2 ring-indigo-500/50 z-10' : STATUS_COLORS[ticket.status]}
              ${belongsToActiveUser ? 'bg-emerald-950 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}
              ${!isInteractive && !isSwappingSource ? 'cursor-not-allowed opacity-100' : 'active:scale-90 cursor-pointer'}
              aspect-square ${isFullScreen ? 'text-xl sm:text-5xl' : 'text-lg sm:text-2xl'} border-2
            `}
          >
            {/* The Number - Slightly faded when occupied to emphasize the X */}
            <span className={`relative z-10 text-white drop-shadow-lg ${isOccupied && !isSwappingSource ? 'opacity-40' : 'opacity-100'}`}>
              {ticket.id}
            </span>
            
            {/* The "X" overlay - Large and centered */}
            {isOccupied && !isSwappingSource && (
               <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
                  <X 
                    className={`w-full h-full opacity-100 scale-125 ${belongsToActiveUser ? 'text-emerald-400' : 'text-red-600'}`} 
                    strokeWidth={isFullScreen ? 6 : 5}
                  />
               </div>
            )}
            
            {/* Swap indicator */}
            {isSwappingSource && (
              <RefreshCw className={`absolute top-1 right-1 animate-spin-slow opacity-80 ${isFullScreen ? 'w-4 h-4 sm:w-6 sm:h-6' : 'w-3 h-3 sm:w-4 sm:h-4'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TicketGrid;
