var TestData2 = {
	FCFS: {
		data: [
			[0, 5, 0, null, 0, 4, 0, 5],
			[1, 3, 0, null, 5, 7, 5, 8],
			[2, 4, 0, null, 8, 11, 8, 12],
			[3, 4, 13, null, 13, 16, 0, 4],
			[4, 3, 15, null, 17, 19, 2, 5],
			[5, 5, 20, null, 20, 24, 0, 5]
		],

		logs: [
			0, 0, 0, 0, 0, 1, 1, 1, 2, 2,
			2, 2, -1, 3, 3, 3, 3, 4, 4, 4,
			5, 5, 5, 5, 5
		]
	},

	RR: {
		quanta: 4,

		data: [
			[0, 5, 0, null, 0, 4, 0, 5],
			[1, 4, 6, null, 6, 9, 0, 4],
			[2, 6, 10, null, 10, 23, 8, 14],
			[3, 6, 10, null, 14, 25, 10, 16],
			[4, 8, 10, null, 18, 29, 12, 20],
			[5, 6, 31, null, 31, 38, 2, 8],
			[6, 2, 35, null, 35, 36, 0, 2]
		],

		logs: [
			0, 0, 0, 0, 0, -1, 1, 1, 1, 1,
			2, 2, 2, 2, 3, 3, 3, 3, 4, 4,
			4, 4, 2, 2, 3, 3, 4, 4, 4, 4,
			-1, 5, 5, 5, 5, 6, 6, 5, 5
		]
	},

	PriorityNonPreemptive: {
		data: [
			[0, 4, 0, 1, 3, 6, 3, 7],
			[1, 2, 0, 0, 7, 8, 7, 9],
			[2, 3, 0, 2, 0, 2, 0, 3],
			[3, 4, 10, 1, 10, 13, 0, 4],
			[4, 3, 11, 0, 19, 21, 8, 11],
			[5, 5, 12, 2, 14, 18, 2, 7]
		],

		logs: [
			2, 2, 2, 0, 0, 0, 0, 1, 1, -1,
			3, 3, 3, 3, 5, 5, 5, 5, 5, 4,
			4, 4
		]
	},

	PriorityPreemptive: {
		data: [
			[0, 4, 0, 1, 3, 6, 3, 7],
			[1, 2, 0, 0, 7, 8, 7, 9],
			[2, 3, 0, 2, 0, 2, 0, 3],
			[3, 5, 10, 2, 10, 18, 4, 9],
			[4, 2, 12, 0, 21, 22, 9, 11],
			[5, 4, 13, 3, 13, 16, 0, 4],
			[6, 2, 15, 1, 19, 20, 4, 6],
			[7, 2, 24, 2, 24, 25, 0, 2],
			[8, 2, 26, 1, 26, 27, 0, 2]
		],

		logs: [
			2, 2, 2, 0, 0, 0, 0, 1, 1, -1,
			3, 3, 3, 5, 5, 5, 5, 3, 3, 6,
			6, 4, 4, -1, 7, 7, 8, 8
		]
	},

	SJF: {
		data: [
			[0, 4, 0, null, 5, 8, 5, 9],
			[1, 2, 0, null, 0, 1, 0, 2],
			[2, 3, 0, null, 2, 4, 2, 5],
			[3, 5, 10, null, 10, 14, 0, 5],
			[4, 6, 15, null, 15, 20, 0, 6],
			[5, 4, 17, null, 23, 26, 6, 10],
			[6, 5, 19, null, 27, 31, 8, 13],
			[7, 2, 20, null, 21, 22, 1, 3]
		],

		logs: [
			1, 1, 2, 2, 2, 0, 0, 0, 0, -1,
			3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
			4, 7, 7, 5, 5, 5, 5, 6, 6, 6,
			6, 6
		]
	},

	SRTF: {
		data: [
			[0, 4, 0, null, 5, 8, 5, 9],
			[1, 2, 0, null, 0, 1, 0, 2],
			[2, 3, 0, null, 2, 4, 2, 5],
			[3, 6, 10, null, 10, 23, 8, 14],
			[4, 3, 12, null, 12, 14, 0, 3],
			[5, 3, 13, null, 15, 17, 2, 5],
			[6, 2, 16, null, 18, 19, 2, 4]
		],

		logs: [
			1, 1, 2, 2, 2, 0, 0, 0, 0, -1,
			3, 3, 4, 4, 4, 5, 5, 5, 6, 6,
			3, 3, 3, 3
		]
	}
};