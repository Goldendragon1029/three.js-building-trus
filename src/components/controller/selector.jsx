import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { trussType, trussWidth, trussLength, trussHeight, legType, roofPitch } from '../../redux/action';

const Selector = (props) => {
  const [settingType, setSettingType] = React.useState(props.item[0]);
  const dispatch = useDispatch();
  const handleChange = (event) => {
    setSettingType(event.target.value);
    switch (props.action) {
      case 'trussType':
        dispatch(trussType(event.target.value));
        break;
      case 'trussWidth':
        dispatch(trussWidth(Number(event.target.value)));
        break;
      case 'trussLength':
        dispatch(trussLength(Number(event.target.value)));
        break;
      case 'trussHeight':
        dispatch(trussHeight(Number(event.target.value)));
        break;
      case 'legType':
        dispatch(legType(event.target.value.split(" ")[0]));
        break;
      case 'roofPitch':
        dispatch(roofPitch(Number(event.target.value.split("/")[0])));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <FormControl className='w-full px-10 mx-0' sx={{ m: 1, minWidth: 200 }}>
        <InputLabel className='px-12' id="Setting-type">{props.title}</InputLabel>
        <Select
          className='w-full'
          labelId="Setting-type"
          value={settingType}
          label="Setting Type"
          onChange={handleChange}
        >
          {props.item.map((item, index) => (
            <MenuItem value={item} key={index}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default Selector