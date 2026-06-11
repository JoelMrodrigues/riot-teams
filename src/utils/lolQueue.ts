/** Libellé lisible d'une file LoL (queueId Spectator/Match). */
export function queueLabel(id: number): string {
  switch (id) {
    case 420: return 'Classé Solo/Duo';
    case 440: return 'Classé Flex';
    case 450: return 'ARAM';
    case 400: return 'Normale (Draft)';
    case 430: return 'Normale (Blind)';
    case 490: return 'Normale (Quickplay)';
    case 700: return 'Clash';
    case 0:   return 'Partie personnalisée';
    default:  return 'Partie';
  }
}
