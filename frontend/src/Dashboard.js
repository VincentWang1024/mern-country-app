import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell, Box
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      flag: '',
      name: '',
      captical: '',
      currencies: '',
      region: '',
      coodr: '',
      timezones:'',
      population:'',
      area:'',
      maps:'',
      translations:'',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      rowsPerPage: 5,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  }

  getProduct = () => {
    
    this.setState({ loading: true });

    let data = '';
    // data = `${data}page=${this.state.page}`;

    data = `${data}`;

    if (this.state.search) {
      data = `${data}${this.state.search}`; 
    }
    axios.get(`https://restcountries.com/v3.1/name/${this.state.search}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      // this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
      console.log(res.data);
      this.setState({ loading: false, products: res.data, pages: res.data.pages});
      
    }).catch((err) => {
      // swal({
      //   text: err.response.data.errorMessage,
      //   icon: "error",
      //   type: "error"
      // });
      this.setState({ loading: false, products: [], pages: 1 },()=>{});
    });
  }

  deleteProduct = (id) => {
    axios.post('http://localhost:2000/delete-product', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 1 });
  };

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('discount', this.state.discount);
    file.append('price', this.state.price);

    axios.post('http://localhost:2000/add-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductClose();
      this.setState({ name: '', desc: '', discount: '', price: '', file: null, page: 1 }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductClose();
    });

  }

  updateProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('discount', this.state.discount);
    file.append('price', this.state.price);

    axios.post('http://localhost:2000/update-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductEditClose();
      this.setState({ name: '', desc: '', discount: '', price: '', file: null }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductEditClose();
    });

  }

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      fileName: ''
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (data) => {
    this.setState({
      openProductEditModal: true,
      name: data.name,
      translations: data
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
      >
        <h2>Dashboard</h2>
        <div>
          {/* Uncomment the following code to add the "Add Product" button */}
          {/* <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Product
          </Button> */}
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>
      </Box>
        {/* Edit Product */}
        <Dialog
          open={this.state.openProductEditModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Translation details</DialogTitle>
          <DialogContent>
            <TableContainer>
            <Table>
              <TableBody>
              {Object.keys(this.state.translations).map((language) => {
                const translation = this.state.translations[language];
                console.log(translation);
                return (
                  <TableRow key={language}>
                    <TableCell>{language}</TableCell>
                    <TableCell>{translation.official}</TableCell>
                    <TableCell>{translation.common}</TableCell>
                  </TableRow>
                );
              })}

              </TableBody>
            </Table>
      </TableContainer>
            
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Product */}
        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
                // inputProps={{
                //   accept: "image/*"
                // }}
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
                required
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == '' || this.state.file == null}
              onClick={(e) => this.addProduct()} color="primary" autoFocus>
              Add Product
            </Button>
          </DialogActions>
        </Dialog>
        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search country"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Flag</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Captical</TableCell>
                <TableCell align="center">Region</TableCell>
                {/* <TableCell align="center">Currency</TableCell> */}
                <TableCell align="center">Coordinate</TableCell>
                <TableCell align="center">Area</TableCell>
                <TableCell align="center">Population</TableCell>
                <TableCell align="center">Map Link</TableCell>
                <TableCell align="center">Translations</TableCell>
                {/* <TableCell align="center">Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
              
                <TableRow key={row.name.common}>
                  <TableCell align="center" component="th" scope="row">
                    <img src={row.flags.svg} width="50" height="30" />
                  </TableCell>
                  <TableCell align="center">{row.name.common}</TableCell>
                  <TableCell align="center">{row.capital}</TableCell>
                  <TableCell align="center">{row.region}</TableCell>
                  {/* <TableCell align="center">{Object.keys(currencies).map(k=>k)}</TableCell> */}
                  <TableCell align="center">{row.latlng[0].toFixed(2)+", "+row.latlng[1].toFixed(2)}</TableCell>
                  <TableCell align="center">{row.area.toFixed(2)}</TableCell>
                  <TableCell align="center">{row.population}</TableCell>
                  <TableCell align="center"><a href={row.maps.googleMaps} target="_blank">{row.maps.googleMaps}</a></TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleProductEditOpen(Object.values(row.translations))}
                    >
                      Details
                  </Button>
                  {/* <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteProduct(row._id)}
                    >
                      Delete
                  </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination 
          component="div"
          count={this.state.pages} 
          page={this.state.page} 
          onChange={this.pageChange} 
          rowsPerPage={this.state.rowsPerPage}
          onRowsPerPageChange={this.handleChangeRowsPerPage} 
          color="primary" />
        </TableContainer>

      </div>
    );
  }
}