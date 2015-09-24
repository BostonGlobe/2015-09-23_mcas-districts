'use strict';

const iframeResizer = require('pym-iframe-resizer');

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};
iframeResizer.resizer(onPymParentResize);

// initialize third-party libraries
const queryString = require('query-string');
const _ = require('lodash');
const $ = require('jquery');
const dataTable = require('datatables');
$.fn.DataTable = dataTable;

// $('table').DataTable();

// get districts data
const districts = require('./../data/districts.json');

// create list of districts, ordered alpha
// we will use this later
const districtsList = _(districts)
	.pluck('district')
	.uniq()
	.sortBy(d=>d)
	.value();

// get the query string district param
const parentUrl = queryString.parse(location.search).parentUrl;
const parentQueryString = queryString.extract(parentUrl);
let districtParam = queryString.parse(parentQueryString).district;

// if we don't have a district param,
// choose the first one
if (!districtParam) {
	districtParam = districtsList[0];
}

// construct districts dropdown
const districtsOptions = _(districtsList)
	.map(d => {

		const selected = d === districtParam ?
			'selected' :
			'';

		return `<option ${selected}>${d}</option>`;
	})
	.value().join('');

// populate districts dropdown
$('.districts-dropdown-wrapper select').html(districtsOptions);

