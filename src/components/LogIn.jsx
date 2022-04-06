import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Authentication from '../auth/authentication';
import photo from '../shared/assets/images/Fingerprint-bro.svg'
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


const MyForm = styled(Form)`
	border-radius:10px;
	box-shadow: 5px 0px 3px #489cea;
	padding:10px
`;

const MyAlert = styled(Alert)`
	position: sticky;
	top: 0px
`;


const LogIn = () => {
	const navigate = useNavigate();
	const [unAuthenticated, setAuthentication] = useState(false)
	const [errorMessage, setErrorMessage] = useState('');
	const validate = values => {
		const errors = {};

		if (!values.email) {
			errors.email = 'Required';
		} else if (values.email.length < 4) {
			errors.email = 'Must be 4 characters or more';
		}

		if (!values.password) {
			errors.password = 'Required';
		} else if (values.password.length < 8) {
			errors.password = 'Must be 8 characters or more';
		}
		return errors;
	};
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate,
		onSubmit: values => {
			Authentication.LogIn(values).then((res) => {
				if(res.data.data.user.role === 'admin'){
					localStorage.setItem('token', res.data.token)
					navigate('/users') 
				}else{
					setAuthentication(true);
					setErrorMessage("Invalid Username or Password")
					setTimeout(() => {
						setAuthentication(false)
					}, 3000);
				}
			}).catch(error => {
				setAuthentication(true);
				setErrorMessage("Invalid Username or Password")
				setTimeout(() => {
					setAuthentication(false)
				}, 3000);
			})

		}
	});

	return (
		<>
			{unAuthenticated ? <MyAlert variant='danger'>
				{errorMessage}
			</MyAlert> : ''}
			<div className="grid grid-cols-2 items-center p-5">
				<img
					src={photo}
					alt="finger"
				/>
				<MyForm onSubmit={formik.handleSubmit}>
					<Typography variant="h2" gutterBottom component="div">
						Log In
					</Typography>
					<Form.Group className="mb-3" controlId="formBasicUserName">
						<Form.Label>Username</Form.Label>
						<Form.Control className={formik.touched.email && formik.errors.email ? "is-invalid" : ''} type="email" name="email" placeholder="email" onChange={formik.handleChange} onBlur={formik.handleBlur}
							value={formik.values.email} autoComplete="on" />
						{formik.touched.email && formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control className={formik.touched.password && formik.errors.password ? "is-invalid" : ''} type="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur}
							value={formik.values.password} placeholder="Password" autoComplete="on" />
						{formik.touched.password && formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : null}
					</Form.Group>
					<Button variant="primary" type="submit">
						Log In
					</Button>
				</MyForm>
			</div>
		</>
	);
};

export default LogIn;