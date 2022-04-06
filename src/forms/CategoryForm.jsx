

import { useState, createRef } from "react";
import Form from 'react-bootstrap/Form';
import { Button, Modal } from "react-bootstrap";
import { useFormik } from 'formik';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Required';
    }
    return errors;
};
const mainCategoriesList = ["Fashion","Phones & Tablets","Electronics"]
const CategoryForm = (props) => {
    const myFormData = new FormData()
    const inputFile = createRef()
    const [searchMainCategory, setSearchMainCategory] = useState('')
    const [categoryInfo] = useState(props.category);
    const [imageSource,setImageSource] = useState(categoryInfo?.photo)
    const [showForm, setShowForm] = useState(false);
    const handleMainCategoryChange = (event) => {
        setSearchMainCategory(event.target.value)
    }
    const handlePhotoChange = ()=>{
        const photo = inputFile.current.files[0]
        myFormData.set('photo', photo)
        axios.post('http://localhost:3000/utils', myFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res=>{
            setImageSource(res.data)
        })
    }
    const myFormik = useFormik({
        initialValues: {
            name: categoryInfo?.name || '',
            photo: ''
        },
        validate,
        onSubmit: values => {
            switch (props.formType) {
                case 'Add':
                    axios.post('http://localhost:3000/category', { name: values.name, photo: imageSource,mainCategory:searchMainCategory }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(() => {
                        axios.put('http://localhost:3000/category').then(res => {
                            props.setCategories(res.data.data.categories)
                        })
                    })   
                    break;
                case 'Edit':
                    axios.patch(`http://localhost:3000/category/${categoryInfo?.name}`, { newName: values.name, photo: imageSource }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(res => {
                        axios.put('http://localhost:3000/category').then(res => {
                            props.setCategories(res.data.data.categories)
                        })
                    }).catch(error => { console.log(error) })
                    break;
                default:
            }
            myFormik.resetForm()
            setShowForm(false)
        },
        onReset: () => {
            setShowForm(false)
        }
    })
    return <>
        <Button className="ml-3 mr-3" variant="primary" onClick={() => { setShowForm(true); }}>{props.formType}</Button>
        <Modal show={showForm} onHide={() => setShowForm(false)} >
            <Modal.Header closeButton>
                <Modal.Title>{props.formType === 'Add' ? 'Add New Category' : 'Edit Category'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={myFormik.handleSubmit} className="p-2">
                <Avatar
                className="m-auto mb-3"
                    alt="Category Photo"
                    src={imageSource}
                    sx={{ width: 150, height: 150 }}
                >
                    C
                </Avatar>
                <Form.Group className="mb-3" controlId="formBasicPhoto">
                    <Form.Control type="file" ref={inputFile} name="photo" placeholder="photo" onChange={handlePhotoChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Control className={myFormik.touched.name && myFormik.errors.name ? "is-invalid" : ''} required type="text" name="name" placeholder="Category Name" onChange={myFormik.handleChange} onBlur={myFormik.handleBlur}
                        value={myFormik.values.name} autoComplete="on" />
                    {myFormik.touched.name && myFormik.errors.name ? <div className="text-danger">{myFormik.errors.name}</div> : null}
                </Form.Group>
                {props.formType === 'Add' ? <FormControl sx={{ marginRight: 1, minWidth: 150 }}>
                    <InputLabel id="demo-simple-select-label">Main Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchMainCategory}
                        label="Main Category"
                        onChange={handleMainCategoryChange}
                    >
                        {mainCategoriesList.map((ele, index) => (
                            <MenuItem key={index} value={ele}>{ele}</MenuItem>
                        ))}
                    </Select>
                </FormControl> : ''}
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        {props.formType === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                    <Button type="reset" variant="secondary" onClick={myFormik.handleReset}>
                        Close
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
}

export default CategoryForm
