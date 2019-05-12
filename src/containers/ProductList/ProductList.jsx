import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const ProductListDiv = styled.div``;

const ProductList = ({ query }) => {
	return <ProductListDiv>{query}</ProductListDiv>;
};

ProductList.propTypes = {
	query: PropTypes.string.isRequired
};

export default ProductList;
