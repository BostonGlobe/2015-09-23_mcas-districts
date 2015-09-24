'use strict';

const iframeResizer = require('pym-iframe-resizer');

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};

iframeResizer.resizer(onPymParentResize);

// initialize third-party libraries
const naturalSort = require('javascript-natural-sort');
const queryString = require('query-string');
const _ = require('lodash');
const $ = require('jquery');
const dataTable = require('datatables');
$.fn.DataTable = dataTable;

// enable natural sorting in datatable
$.extend($.fn.dataTableExt.oSort, {
	'natural-asc': (a, b) => naturalSort(a, b),
	'natural-desc': (a, b) => naturalSort(a, b) * -1
});

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

// get the chosen district object
const district = _.filter(districts, {district: districtParam});

// construct district body
const tbody = _(district)
	.map(d => {

		return `
				<tr>
					<th>${d.grade}</th>
					<th>${d.subject}</th>
					<th>${d.advanced}</th>
					<th>${d.proficient}</th>
					<th>${d.needs_improvement}</th>
					<th>${d.warning}</th>
					<th>${d.tested}</th>
				</tr>
			`;
	})
	.value().join('');

// populate table tbody with district rows
$('table tbody').html(tbody);

// convert to DataTable,
// and group by first column (grade)
let table = $('table').DataTable({
	columnDefs: [
		{ visible: false, type: 'natural', targets: 0  }
	],
	order: [[0, 'asc']],
	displayLength: 25,
	drawCallback(settings) {

		var api = this.api();
		var rows = api.rows({page:'current'}).nodes();
		var last = null;

		api.column(0, {page:'current'}).data().each((group, i) => {
			if (last !== group) {
				$(rows).eq(i).before(
					`<tr class="group"><td colspan="6">Grade ${group}</td></tr>`
				);

				last = group;
			}
		});

	}
});

// enable sorting by grade group
$('tbody').on('click', 'tr.group', function() {

	let currentOrder = table.api().order()[0];
	if (currentOrder[0] === 0 && currentOrder[1] === 'asc') {
		table.api().order([0, 'desc']).draw();
	} else {
		table.api().order([0, 'asc']).draw();
	}
});

