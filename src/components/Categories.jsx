import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FilterIcon } from '@heroicons/react/solid'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import CategoryForm from '../forms/CategoryForm';
import axios from 'axios';
import { Button, Table } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

const Categories = () => {
    const navigate = useNavigate();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [searchCategory, setSearchCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const handleAdd = (childData) => {
        setCategories(childData)
    }
    const handleEdit = (childData) => {
        setCategories(childData)
    }
    const handleChange = (event) => {
        if (event.target.value === 'All') {
            axios.put('http://localhost:3000/category').then(res => {
                setCategories(res.data.data.categories)
            })
        } else {
            axios.get(`http://localhost:3000/category/${event.target.value}`).then(res => {
                console.log(res)
                res.data.data.category ? setCategories(() => ([res.data.data.category])) : setCategories([])
            })
        }
        setSearchCategory(event.target.value);
    };
    useEffect(() => {
        axios.put('http://localhost:3000/category').then(res => {
            setCategories(res.data.data.categories)
            setCategoriesList(res.data.data.categories)
        })
    }, [])
    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                                <div className="px-4 flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                    <button
                                        type="button"
                                        className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </Dialog>
                </Transition.Root>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative z-10 flex items-baseline justify-between pt-10 pb-6 border-b border-gray-200">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Categories</h1>

                        <div className="flex items-center">
                            <FormControl sx={{ minWidth: 150, marginRight: 3 }}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={searchCategory}
                                    label="Category"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="All">All Categories</MenuItem>
                                    {categoriesList.map((ele) => (
                                        <MenuItem key={ele._id} value={ele.name}>{ele.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <CategoryForm formType={'Add'} setCategories={handleAdd} />
                            
                            <button
                                type="button"
                                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FilterIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">

                            {/* Product grid */}
                            <div className="lg:col-span-3">
                                {categories.length !== 0 ? <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>photo</th>
                                            <th>name</th>
                                            {/* <th>total sales</th> */}
                                            <th>actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category._id}>
                                                {/* <Link to="/category"> */}
                                                <td>
                                                    <Avatar
                                                        alt="Category Photo"
                                                        src={category.photo}
                                                        sx={{ width: 56, height: 56 }}
                                                    >
                                                        C
                                                    </Avatar>
                                                </td>
                                                <td>{category.name}</td>
                                                {/* <td>total sales</td> */}
                                                <td>
                                                    <Button variant="primary" onClick={() => navigate(`/subCategories/${category.name}`)}>view sub Categories</Button>
                                                    <CategoryForm formType={'Edit'} category={category} setCategories={handleEdit} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table> : <Alert variant='danger'>No Categories Found</Alert>}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Categories