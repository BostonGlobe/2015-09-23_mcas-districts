const _ = require('lodash');
const fs = require('fs');
const d3 = require('d3');

const input = d3.csv.parse(fs.readFileSync('./output/districts.csv', 'utf8'));

const output = _(input)
	.groupBy('district')
	.map(function(d, i) {

		const grades = _(d)
			.groupBy('grade')
			.map(function(d, i) {

				const subjects = _(d)
					.map(function(d, i) {
						return _.omit(d, 'district', 'grade');
					})
					.value();

				return {
					grade: i,
					subjects: subjects
				};

			})
			.sortBy('grade')
			.value();

		return {
			district: i,
			grades: grades
		};

	})
	.value();

fs.writeFileSync('./../src/data/districts.json', JSON.stringify(output, null, 4));
