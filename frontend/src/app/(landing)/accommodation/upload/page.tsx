
import Uploadprogressbar from "@/components/upload/uploadprogressbar";
import Uploadform from "@/components/upload/form"


export default function UploadAccommodation() {


    return (
        <div className="flex flex-row">
            <Uploadprogressbar />
            <Uploadform />
        </div>

    );
}
