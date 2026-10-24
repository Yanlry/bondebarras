import { useSearchParams } from 'react-router'
import RoomCapture from '../dev/RoomCapture'

/** Développement uniquement (`/__capture?etat=avant|apres`) : la pièce seule, pour `npm run capture:room`. */
export default function DevCapture() {
  const [params] = useSearchParams()
  return <RoomCapture state={params.get('etat') === 'apres' ? 'apres' : 'avant'} />
}
