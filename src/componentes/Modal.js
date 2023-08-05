import "./Modal.css";
import CerrarImagen from '../Imagenes/cerrar.png'

const Modal = ({ children, isOpen, closeModal }) => {
  const handleModalContainerClick = (e) => e.stopPropagation();
  

  return (
    <article className={`modal ${isOpen && "is-open"}`} onClick={closeModal}>
      <div className="modal-container" onClick={handleModalContainerClick}>
        <button className="modal-close" onClick={closeModal}><img src={CerrarImagen} className='imagenesMenu' alt=''></img>
          
        </button>
        {children}
      </div>
    </article>
  );
};

export default Modal;