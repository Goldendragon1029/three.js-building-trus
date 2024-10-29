import { TRUSSTYPE, TRUSSWIDTH, TRUSSLENGTH, TRUSSHEIGHT, LEGTYPE, ROOFPITCH } from "./action";

const initialState = {
    trussType: "one",
    trussWidth: 6,
    trussLength: 6,
    trussHeight: 3,
    legType: "one",
    roofPitch: 6,
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