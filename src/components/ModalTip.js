import React, { useState } from 'react';
import {Button, Modal, Form} from 'react-bootstrap';

function ModalTip({post, tipPost}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="btn btn-link btn-sm float-right pt-0" onClick={handleShow}>
        Tips
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tips ETH</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control name="ETH" type="Tip" placeholder="Enter ETH" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(event)=>{
                let value = document.getElementsByName("ETH")[0].value
                const tipAmount = parseFloat(value)
                if(isNaN(tipAmount)){
                    alert('enter number')
                    return
                }
                handleClose()
                tipPost(post.id, window.web3.utils.toWei(tipAmount+"", 'Ether'))
                console.log(tipAmount)
          }}>Tips</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTip;