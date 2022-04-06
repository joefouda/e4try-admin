import { Form } from "react-bootstrap"
import Avatar from '@mui/material/Avatar';
import { useState, createRef, useEffect } from "react";
import { useFormik } from 'formik';
import axios from 'axios';


const ImageUpload = (props) => {
    const myFormData = new FormData()
    const inputFile = createRef()
    const [imageSource, setImageSource] = useState(props.photo)
    const handlePhotoChange = () => {
        const photo = inputFile.current.files[0]
        myFormData.set('photo', photo)
        axios.post('http://localhost:3000/utils', myFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setImageSource(res.data)
        })
    }
    const formik = useFormik({
        initialValues: {
            photo: '',
        },
    });
    useEffect(()=>{
        props.setImage(imageSource)
    },[imageSource])
    return <>
        <Avatar
            className="m-auto mb-3"
            alt="Category Photo"
            src={imageSource}
            sx={{ width: 150, height: 150 }}
        >
            C
        </Avatar>
        <Form>
            <Form.Control type="file" ref={inputFile} name="photo" value={formik.values.photo} placeholder="photo" onChange={handlePhotoChange} />
        </Form>
    </>
}

export default ImageUpload