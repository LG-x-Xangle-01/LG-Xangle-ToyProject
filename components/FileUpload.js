const FileUpload = () => {

	const onChangeHandler = (e) => {
		console.log(e.target.files[0]);
	};

	return (
		<>
			<div style={{ marginTop: '10px' }}>
				<input
					type='file'
					accept='image/*'
					name='img'
					onChange={onChangeHandler}
				/>
			</div>
		</>
	);
};

export default FileUpload;
