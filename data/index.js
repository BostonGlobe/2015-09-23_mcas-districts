const _ = require('lodash');
const fs = require('fs');

const input = JSON.parse(fs.readFileSync('./output/districts.json', 'utf8'));

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
			.value();

		return {
			district: i,
			grades: grades
		};

	})
	.value();

fs.writeFileSync('./../src/data/districts.json', JSON.stringify(output, null, 4));
