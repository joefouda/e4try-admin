
import { useState, createRef, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import { Button, Modal } from "react-bootstrap";
import { useFormik } from 'formik';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Avatar from '@mui/material/Avatar';


// const validate = values => {
//     const errors = {};
//     if (!values.name) {
//         errors.name = 'Required';
//     }

//     if (!values.photo) {
//         errors.photo = 'Required';
//     }
//     return errors;
// };
const mainCategoriesList = ["Fashion","Phones & Tablets","Electronics"]
const ProductForm = (props) => {
    const myFormData = new FormData()
    const inputFile = createRef()
    const [productInfo] = useState(props.product)
    const [imageSource, setImageSource] = useState(productInfo?.photo)
    const [searchMainCategory, setSearchMainCategory] = useState('')
    const [categoriesList, setCategoriesList] = useState([])
    const [searchCategory, setSearchCategory] = useState('')
    const [subCategoriesList, setSubCategoriesList] = useState([])
    const [searchSubCategory, setSearchSubCategory] = useState('')
    const [variants, setVariants] = useState([])
    const [variantOption, setVariantOption] = useState([])
    const [specs, setSpecs] = useState([])
    // const [variantOptions,setVariantOptions] = useState([])
    const [showForm, setShowForm] = useState(false);
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
    const handleMainCategoryChange = (event) => {
        setSearchMainCategory(event.target.value)
        let nestedCategories = props.categories.filter(ele => {
            return ele.mainCategory === event.target.value
        })
        setCategoriesList(() => [...nestedCategories])
    }
    const handleCategoryChange = (event) => {
        axios.get(`http://localhost:3000/category/${event.target.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            res.data.data.category.subCategories ? setSubCategoriesList(res.data.data.category.subCategories) : setSubCategoriesList([])
        })
        setSearchCategory(event.target.value);
    };
    const handleSubCategoryChange = (event) => {
        axios.get(`http://localhost:3000/variant/${event.target.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setVariants(res.data.data.variants)
        })
        setSearchSubCategory(event.target.value);
    };
    const handleOptionChange = (event, variant) => {
        setVariantOption(event.target.value)
        setSpecs((oldSpecs) => [...oldSpecs, { name: variant, value: event.target.value }])
    }
    const myFormik = useFormik({
        initialValues: {
            name: productInfo?.name || '',
            photo: '',
            description: productInfo?.description || '',
            price: productInfo?.price || '',
            stock: productInfo?.stock || '',
        },
        // validate,
        onSubmit: values => {
            console.log('clicked')
            switch (props.formType) {
                case 'Add':
                    const addData = {
                        name: values.name,
                        photo: imageSource,
                        description: values.description,
                        price: values.price,
                        stock: values.stock,
                        category: searchCategory,
                        subCategory: searchSubCategory,
                        specs: specs
                    }
                    axios.post('http://localhost:3000/product', addData, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(() => {
                        axios.put('http://localhost:3000/stats', {}, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }).then(res => {
                            props.setProducts(res.data.data.products)
                        })
                    })
                    break;
                case 'Edit':
                    const editData = {
                        _id: productInfo?._id,
                        name: values.name,
                        photo: imageSource,
                        description: values.description,
                        price: values.price,
                    }
                    axios.patch('http://localhost:3000/edit', editData, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(res => {
                        axios.put('http://localhost:3000/stats', {}, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }).then(res => {
                            props.setProducts(res.data.data.products)
                        })
                    })
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
    useEffect(() => {

    })
    return <>
        <Button className="ml-3 mr-3" variant="primary" onClick={() => { setShowForm(true); }}>{props.formType}</Button>
        <Modal show={showForm} onHide={() => setShowForm(false)} >
            <Modal.Header closeButton>
                <Modal.Title>{props.formType === 'Add' ? 'Add New Product' : 'Edit Product'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={myFormik.handleSubmit} className="p-2">
                <Avatar
                    className="m-auto mb-3"
                    alt="Category Photo"
                    src={imageSource}
                    sx={{ width: 150, height: 150 }}
                >
                    P
                </Avatar>
                <Form.Group className="mb-3" controlId="formBasicPhoto">
                    <Form.Control type="file" ref={inputFile} name="photo" placeholder="photo" onChange={handlePhotoChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Control className={myFormik.touched.name && myFormik.errors.name ? "is-invalid" : ''} required type="text" name="name" placeholder="Name" onChange={myFormik.handleChange} onBlur={myFormik.handleBlur}
                        value={myFormik.values.name} autoComplete="on" />
                    {myFormik.touched.name && myFormik.errors.name ? <div className="text-danger">{myFormik.errors.name}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Control className={myFormik.touched.description && myFormik.errors.description ? "is-invalid" : ''} type="text" name="description" placeholder="description" onChange={myFormik.handleChange} onBlur={myFormik.handleBlur}
                        value={myFormik.values.description} autoComplete="on" />
                    {myFormik.touched.description && myFormik.errors.description ? <div className="text-danger">{myFormik.errors.description}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Control className={myFormik.touched.price && myFormik.errors.price ? "is-invalid" : ''} type="number" name="price" placeholder="price" onChange={myFormik.handleChange} onBlur={myFormik.handleBlur}
                        value={myFormik.values.price} autoComplete="on" />
                    {myFormik.touched.price && myFormik.errors.price ? <div className="text-danger">{myFormik.errors.price}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicStock">
                    <Form.Control className={myFormik.touched.stock && myFormik.errors.stock ? "is-invalid" : ''} type="text" name="stock" placeholder="stock" onChange={myFormik.handleChange} onBlur={myFormik.handleBlur}
                        value={myFormik.values.stock} autoComplete="on" />
                    {myFormik.touched.stock && myFormik.errors.stock ? <div className="text-danger">{myFormik.errors.stock}</div> : null}
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
                {categoriesList.length !== 0 && props.formType === 'Add' ? <FormControl sx={{ marginRight: 1, minWidth: 150 }}>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchCategory}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        {categoriesList.map((ele) => (
                            <MenuItem key={ele._id} value={ele.name}>{ele.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl> : ''}
                {subCategoriesList.length !== 0 && props.formType === 'Add' ? <FormControl sx={{ marginRight: 1, minWidth: 150 }}>
                    <InputLabel id="demo-simple-select-label">Sub Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchSubCategory}
                        label="Sub Category"
                        onChange={handleSubCategoryChange}
                    >
                        {subCategoriesList.map((ele) => (
                            <MenuItem key={ele._id} value={ele.name}>{ele.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl> : ''}
                {props.formType === 'Add' ? variants.map((variant,index) => (
                    <FormControl key={variant._id} sx={{ marginRight: 1, minWidth: 150 }}>
                        <InputLabel id="demo-simple-select-label">{variant.name}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={variantOption[index]}
                            label={variant.name}
                            onChange={(event) => handleOptionChange(event, variant.name)}
                        >
                            {variant.options.map((ele, index) => (
                                <MenuItem key={index} value={ele}>{ele}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )) : ''}
                <Modal.Footer className="mt-3">
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

export default ProductForm
