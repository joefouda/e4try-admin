
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from 'axios';
import { Form, FieldArray, Formik, Field, ErrorMessage } from 'formik';
import ImageUpload from "./imageUploadForm";
const CategoryForm = (props) => {
    const [subCategory] = useState(props.subCategory)
    const [category] = useState(props.category)
    const [imageSource,setImageSource] = useState(subCategory?.photo)
    const [showForm, setShowForm] = useState(false);
    const initialValues = {
        name: subCategory?.name || '',
        variants: subCategory?.variants || [
            {
                name: '',
                options: [],
            },
        ],
    };
    const handleImageChange = (childData)=>{
        setImageSource(childData)
    }
    return <>
        <Button className="ml-3 mr-3" variant="primary" onClick={() => { setShowForm(true); }}>{props.formType}</Button>
        <Modal show={showForm} onHide={() => setShowForm(false)} >
            <Modal.Header closeButton>
                <Modal.Title>{props.formType === 'Add' ? 'Add New Sub Category' : 'Edit Sub Category'}</Modal.Title>
            </Modal.Header>
            <ImageUpload photo={imageSource} setImage={handleImageChange}/>
            <Formik
                initialValues={initialValues}
                // validate={validate}
                onSubmit={async (values) => {
                    switch (props.formType) {
                        case 'Add':
                            const addData = {
                                name: values.name,
                                photo:imageSource,
                                category: category.name,
                                variants:values.variants
                            }
                            console.log(addData)
                            axios.post('http://localhost:3000/subcategory', addData, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            }).then(() => {
                                axios.get(`http://localhost:3000/category/${category.name}`).then(res => {
                                    props.setSubCategories(res.data.data.category.subCategories)
                                    setShowForm(false)                        
                                })
                            })
                            break;
                        case 'Edit':
                            const editData = {
                                newName: values.name,
                                photo:imageSource,
                                category: category,
                                variants:values.variants
                            }
                            axios.patch(`http://localhost:3000/subcategory/${subCategory?.name}`, editData, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            }).then(() => {
                                axios.get(`http://localhost:3000/category/${category.name}`).then(res => {
                                    props.setSubCategories(res.data.data.category.subCategories)
                                    setShowForm(false)
                                })
                            }).catch(error => { console.log(error) })
                            break;
                        default:
                    }
                }}
            >
                {({ values }) => (
                    <Form className="p-3">
                        <Field name="name" className="m-1" placeholder="sub category name" type="text" />
                        <FieldArray name="variants">
                            {({ insert, remove, push }) => (
                                <div>
                                    {values.variants.length > 0 &&
                                        values.variants.map((variant, i) => (
                                            <div className="row" key={i}>
                                                <div className="col">
                                                    <Field
                                                        name={`variants.${i}.name`}
                                                        placeholder="Variant Name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={`variants.${i}.name`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <FieldArray name={`variants[${i}].options`}>
                                                        {({ insert, remove, push }) => (
                                                            <div>
                                                                {values.variants[i].options?.length > 0 &&
                                                                    values.variants[i].options.map((option, index) => (
                                                                        <div className="row" key={index}>
                                                                            <div className="col">
                                                                                <Field
                                                                                    name={`variants.${i}.options.${index}`}
                                                                                    placeholder="Option Name"
                                                                                    type="text"
                                                                                />
                                                                            </div>
                                                                            <div className="col">
                                                                                <button
                                                                                    type="button"
                                                                                    className="secondary"
                                                                                    onClick={() => remove(index)}
                                                                                >
                                                                                    X
                                                                                </button>
                                                                                {/* <button
                                                                                    type="button"
                                                                                    onClick={() => insert(index, '')}
                                                                                >
                                                                                    +
                                                                                </button> */}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                <button
                                                                    type="button"
                                                                    className="secondary"
                                                                    onClick={() => push('')}
                                                                >
                                                                    Add Option
                                                                </button>
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                </div>
                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="secondary"
                                                        onClick={() => remove(i)}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => push({ name: '', options: [] })}
                                    >
                                        Add Variant
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        <Button type="submit">Add</Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    </>
}

export default CategoryForm
