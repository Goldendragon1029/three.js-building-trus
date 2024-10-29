export const TRUSSTYPE = 'TRUSSTYPE';
export const TRUSSWIDTH = 'TRUSSWIDTH';
export const TRUSSLENGTH = 'TRUSSLENGTH';
export const TRUSSHEIGHT = 'TRUSSHEIGHT';
export const LEGTYPE = 'LEGTYPE';
export const ROOFPITCH = 'ROOFPITCH';

export const trussType = (value) => ({
    type: TRUSSTYPE,
    value
});

export const trussWidth = (value) => ({
    type: TRUSSWIDTH,
    value
});

export const trussLength = (value) => ({
    type: TRUSSLENGTH,
    value
});

export const trussHeight = (value) => ({
    type: TRUSSHEIGHT,
    value
});

export const legType = (value) => ({
    type: LEGTYPE,
    value
});

export const roofPitch = (value) => ({
    type: ROOFPITCH,
    value
});