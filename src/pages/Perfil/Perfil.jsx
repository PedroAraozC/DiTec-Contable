import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fotoDefault from "../../assets/person.svg";
import "./Perfil.css";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button } from "@mui/material";
import useStore from "../../Zustand/Zustand";
import Swal from "sweetalert2";
import cdigitalApi from '../../config/axios';
import { Validacion } from "../../components/Registro/Validacion";

const Perfil = () => {
 
  const [isEditing, setIsEditing] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { user,updateUser } = useStore();
  const [confirmarContraseña, setConfirmarContraseña] = useState('');

  const[formData, setFormData]= useState({
      
    documento_persona:user.documento_persona,
    nombre_persona:user.nombre_persona,
    apellido_persona:user.apellido_persona,
    email_persona:user.email_persona,
    clave:"",
    telefono_persona:user.telefono_persona,
    domicilio_persona:user.domicilio_persona,
    localidad_persona:user.localidad_persona,
 })

 const [modalAbierto, setModalAbierto] = useState(false);
 const abrirModal = () => {
    
     setModalAbierto(true);
 };
 const cerrarModal=() => setModalAbierto(false)



  const usuario=user;

  const actualizarUsuarioConFormData = (objeto1, objeto2) => {
    for (const key in objeto2) {
      // eslint-disable-next-line no-prototype-builtins
      if (objeto2.hasOwnProperty(key) && objeto1.hasOwnProperty(key)) {
        // Verificar si el valor del campo es de tipo string
        if (typeof objeto2[key] === 'string') {
          // Aplicar toUpperCase() al valor del campo
          objeto1[key] = objeto2[key].toUpperCase();
        } else {
          // Si no es de tipo string, asignar el valor sin modificar
          objeto1[key] = objeto2[key];
        }
      }
    }
  };
  
  
 
  const handleChange = (e, lon) => {
    let value = e.target.value; // Eliminar espacios en blanco alrededor del valor
    
    if (  e.target.name === "documento_persona") {
      value = value !== "" ? parseInt(value.slice(0, lon), 10) : ""; // Convertir a número si no está vacío
    } else if (e.target.type === "number") {
      value = value.slice(0, lon); // Limitar la longitud si es necesario
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // const validator = () => {
  //   setValidado(!validado);
 
  // };

  const EditarCiudadanoDB= async (data) =>
  {
  
      try{
          await cdigitalApi.put(`/usuarios/editar`,data);
          
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Cambios realizados con éxito! `,
            showConfirmButton: false,
            timer: 2500
          });

          actualizarUsuarioConFormData(user, data);
          console.log(user)
          
          updateUser(user);
           setIsEditing(!isEditing)
        
        
      }
  
      catch(error)
      {
      console.log(error);
      }
}
  
  const handleEditDatos = async (e) =>{
  

    e.preventDefault();
  
   
      
        // ! Verificar Email
        const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 if(!patronEmail.test(formData.email_persona)){
            return Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'El correo electronico que ingresaste no es válido',                
              })
        }

 if( formData.clave.length == ""){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'Debe ingresar una clave',                
            })
      }
       
if( formData.clave !== confirmarContraseña){
            return Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'Las claves no coinciden',                
              })
        }

if( formData.clave.length < 6){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'La clave debe tener 6 caracteres como mínimo',                
            })
      }

if( formData.clave.length > 30){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'La clave debe tener 30 caracteres como máximo',                
          })
    }

 if( formData.documento_persona.length > 8){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'El DNI no puede tener mas de 8 dígitos',                
            })
      }

 if( formData.telefono_persona <0){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'El nro de celular no puede ser negativo',                
          })
    }

 if( formData.documento_persona <0){
      return Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: 'El DNI no puede ser negativo',                
        })
  }

 if( formData.telefono_persona.length != 10){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'El nro de celular debe tener 10 dígitos sin guiones ejemplo: 3814123456',                
          })
    }


EditarCiudadanoDB(formData)
    
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column p-2 mt-3 contenedorPerfil">
        <div className="d-flex py-4 px-2 justify-content-between align-items-center gap-3">
          <img src={fotoDefault} alt="Foto de perfil" className="fotoPerfil" />
          {usuario.validado==1 ? (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <p className="m-0">Usuario validado: </p>
              <FontAwesomeIcon icon={faCheck}  />
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <p className="m-0">Usuario validado: </p>
              <FontAwesomeIcon icon={faXmark}  />
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="px-2">
            <p className="datoUsuario">Nombre/s:</p> <p>{usuario.nombre_persona}</p>
            <p className="datoUsuario">Apellidos:</p> <p>{usuario.apellido_persona}</p>
            <p className="datoUsuario">DNI:</p> <p>{usuario.documento_persona}</p>
            <p className="datoUsuario">Fecha nacimiento:</p> <p>{usuario.fecha_nacimiento_persona.split('T')[0] }</p>
            <p className="datoUsuario">Localidad:</p> <p> {usuario.localidad_persona}</p>
            <p className="datoUsuario">Domicilio:</p> <p> {usuario.domicilio_persona}</p>
            <p className="datoUsuario">Telefono:</p> <p> {usuario.telefono_persona}</p>
            <p className="datoUsuario">Email:</p> <p>{usuario.email_persona}</p>
            <p className="datoUsuario">Contraseña:</p> <p> ***********</p>
          </div>
        ) : ( 
          <form className="px-2 d-flex flex-column formEdit">
 <p className="datoUsuario">Nombre/s:</p>
            <input type="text" placeholder="Nombre" className="inputEditPerfil" 
             onChange={handleChange} value={formData.nombre_persona} name="nombre_persona" autoFocus/>
<p className="datoUsuario">Apellidos:</p>
            <input type="text" placeholder="Apellido" className="inputEditPerfil" 
             onChange={handleChange} value={formData.apellido_persona} name="apellido_persona"/>
 <p className="datoUsuario">DNI:</p>
            <input type="number" placeholder="Documento" className="inputEditPerfil" 
             onChange={(e) => handleChange(e, 8)} value={formData.documento_persona} name="documento_persona"/>
{/* <p className="datoUsuario">Localidad:</p>
            <input type="text" placeholder="Localidad" className="inputEditPerfil" 
             onChange={handleChange} value={formData.localidad_persona} name="localidad_persona"/> */}
  <p className="datoUsuario">Domicilio:</p>
            <input type="text" placeholder="Domicilio" className="inputEditPerfil"
             onChange={handleChange} value={formData.domicilio_persona} name="domicilio_persona"/>
<p className="datoUsuario">Telefono:</p>
            <input type="number" placeholder="Telefono o Celular" className="inputEditPerfil"
             onChange={(e)=>handleChange(e,10)} value={formData.telefono_persona} name="telefono_persona"/>
 <p className="datoUsuario">Email:</p>
            <input type="email" placeholder="Correo electronico" className="inputEditPerfil"
             onChange={handleChange} value={formData.email_persona} name="email_persona" />
<p className="datoUsuario">Contraseña:</p>
            <input type="password" placeholder="Contraseña nueva" className="inputEditPerfil"
             onChange={handleChange} value={formData.clave} name="clave" required/>
<p className="datoUsuario">Confirmar contraseña:</p>
            <input type="password" placeholder="Confirmar contraseña" className="inputEditPerfil" 
             onChange={(e) => setConfirmarContraseña(e.target.value)} required/>
          </form>
        )}
        <div className="d-flex justify-content-between">
          {
            isEditing?
            <Button onClick={() => setIsEditing(!isEditing)}>Editar datos</Button>
            :
            <Button onClick={handleEditDatos}>Guardar Cambios</Button>
            
          }
          <Button onClick={abrirModal} >Validar email</Button>
        </div>
   
      
      </div>

      {modalAbierto && (
  <Validacion 
  data={formData}
  cerrarModal={cerrarModal}
  setModalAbierto={setModalAbierto}
  />
)} 




    </div>
  );
};

export default Perfil;
