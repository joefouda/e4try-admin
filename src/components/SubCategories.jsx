import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import SubCategoriesForm from '../forms/SubCategoriesForm'
import Avatar from '@mui/material/Avatar';


const SubCategories = () => {
    const [subCategories, setSubCategories] = useState([])
    const [category, setCategory] = useState({})
    const { categoryName } = useParams()
    const handleAdd = (childData) => {
        setSubCategories(childData)
    }
    const handleEdit = (childData) => {
        setSubCategories(childData)
    }
    useEffect(() => {
        axios.get(`http://localhost:3000/category/${categoryName}`).then(res => {
            setCategory(res.data.data.category)
            res.data.data.category.subCategories.length !== 0 ? setSubCategories(res.data.data.category.subCategories) : setSubCategories([])
        })
    }, [categoryName])
    return <>
        {subCategories.length !== 0 ? <Table striped bordered hover>
            <thead>
                <tr>
                    <th>photo</th>
                    <th>name</th>
                    {/* <th>total sales</th> */}
                    <th><SubCategoriesForm formType={'Add'} category={category} setSubCategories={handleAdd} /></th>
                </tr>
            </thead>
            <tbody>
                {subCategories.map((subCategory) => (
                    <tr key={subCategory._id}>
                        <td>
                            <Avatar
                                alt="Category Photo"
                                src={subCategory.photo}
                                sx={{ width: 56, height: 56 }}
                            >
                                S
                            </Avatar>
                        </td>
                        <td>{subCategory.name}</td>
                        {/* <td>total sales</td> */}
                        <td>
                            <SubCategoriesForm formType={'Edit'} subCategory={subCategory} category={category} setCategories={handleEdit} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table> : <Alert variant='danger'>
            No Sub Categories for {category.name} yet <SubCategoriesForm formType={'Add'} category={category} setSubCategories={handleAdd} />
        </Alert>}
    </>
}

export default SubCategories