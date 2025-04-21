import RatingsForAcc from '@/components/Rating/RatingsForAcc';
import RatingForm from '@/components/Rating/RatingForm';

type RatingContainerProps = {
    accommodationId: number;
}
export default function RatingContainer ({ accommodationId } : RatingContainerProps) {
    return (
    <>
        <RatingsForAcc accommodationId={accommodationId} />
        <RatingForm accommodationId={accommodationId} />
    </>
    );
}

