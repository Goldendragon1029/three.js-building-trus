import { TRUSSTYPE, TRUSSWIDTH, TRUSSLENGTH, TRUSSHEIGHT, LEGTYPE, ROOFPITCH } from "./action";

const initialState = {
    trussType: "Standard",
    trussWidth: 25,
    trussLength: 25,
    trussHeight: 4,
    legType: "Single",
    roofPitch: 2,
}

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case TRUSSTYPE:
            return { ...state, trussType: action.value};
        case TRUSSWIDTH:
            return { ...state, trussWidth: action.value};
        case TRUSSLENGTH:
            return { ...state, trussLength: action.value};
        case TRUSSHEIGHT:
            return { ...state, trussHeight: action.value};
        case LEGTYPE:
            return { ...state, legType: action.value};
        case ROOFPITCH:
            return { ...state, roofPitch: action.value};
        default: return state;
    }
};

export default counterReducer;