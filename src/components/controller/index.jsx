import { useState } from "react";
import Selector from "./selector";

const Controller = () => {
    const [handleShow, setHandleShow] = useState(false);
    
    const handleChange = () => {
        setHandleShow(!handleShow);
    }
  
    return (
        <>
            <div className={`bg-white mt-20 z-50 min-h-full tablet:min-w-350 tablet:block large:min-w-450 min-w-300 ${handleShow ? 'block fixed' : 'hidden'}`}>
                <h1 className="mb-10 text-center text-gray text-30">Setting</h1>
                <Selector
                    title="Truss Type"
                    item={["one", "two", "three"]}
                    action="trussType"
                />
                <Selector
                    title="Truss Width"
                    item={[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 35, 40, 45, 50]}
                    action="trussWidth"
                />
                <Selector
                    title="Truss Length"
                    item={[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 35, 40, 45, 50]}
                    action="trussLength"
                />
                <Selector
                    title="Truss Height"
                    item={[4, 6, 8, 10]}
                    action="trussHeight"
                />
                <Selector
                    title="Roof Pitch"
                    item={["2/12", "4/12", "6/12", "8/12", "10/12"]}
                    action="roofPitch"
                />
            </div>
            <button className={`z-10 tablet:hidden relative -mr-30 ${handleShow ? 'left-300' : 'left-0'}`} onClick={handleChange}>
                <img src={`/image/${handleShow ? 'left' : 'right'}-arrow.png`} alt="toggle" className="min-w-30 min-h-30" width={30} height={30}></img>
            </button>
        </>
    );
};

export default Controller