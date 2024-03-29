import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from '../../config/axios';
import useStore from '../Zustand/Zustand';

const FormCapitalHumano = ()=> {
  const [procedimientos, setProcedimientos] = React.useState([]);
  const [procedimientoElegido, setProcedimientoElegido] = React.useState({procedimiento: ""});
  const { setResultSearch, setValuesCapHumano } = useStore();

  const formatProcedimientoName = (procedimiento) => {
    const palabras = procedimiento.substring(2).split("_");
    let nombreFormateado = palabras
      .map((palabra) => {
        const primeraLetra = palabra.charAt(0).toUpperCase();
        const restoPalabra = palabra.slice(1).toLowerCase();
        return primeraLetra + restoPalabra;
      })
      .join(" ");
  
    return nombreFormateado;
  };

  const obtenerProcedimientosAlmacenados = async () => {
    try {
      const resultado = await axios.get("/listar/listarProcedimientos");
      setProcedimientos(resultado.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async (SP) => {
    try {
      const obj = {procedimiento : SP}
      const resultado = await axios.post("/listar/ejecutarProcedimiento", obj);
      setResultSearch(resultado.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerProcedimientosAlmacenados();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setValuesCapHumano(value)
    getData(value)
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="">Procedimientos</InputLabel>
        <Select
          value={procedimientoElegido.value}
          onChange={handleChange}
          autoWidth
          label="Procedimientos"
        >
          {procedimientos?.length > 0 ?
                procedimientos
                  ?.filter(
                    (sp) =>
                        sp.ROUTINE_NAME.includes("sp_plantaporreparticion") ||
                        sp.ROUTINE_NAME.includes("sp_plantamunicipal") 
                  )
                  .map((st, index) => (
                    <MenuItem value={st.ROUTINE_NAME} key={index}>
                      {formatProcedimientoName(st.ROUTINE_NAME)}
                    </MenuItem>
                  )) : <p></p>} 
        </Select>
      </FormControl>
    </div>
  );
}

export default FormCapitalHumano;