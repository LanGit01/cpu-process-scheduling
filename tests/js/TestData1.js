var TestData1 = {
	data: [
			[0, 5, 0, 0],
			[1, 3, 0, 2],
			[2, 4, 0, 1],
			[3, 2, 12, 0],
			[4, 8, 16, 1],
			[5, 4, 18, 0],
			[6, 5, 19, 2],
			[7, 3, 35, 2],
			[8, 4, 34, 0],
			[9, 6, 39, 3],
			[10, 4, 40, 1]
	],
	
	FCFS: {
		data: [
			[0, 5, 0, 0, 0, 4, 0, 5],
			[1, 3, 0, 2, 5, 7, 5, 8],
			[2, 4, 0, 1, 8, 11, 8, 12],
			[3, 2, 12, 0, 12, 13, 0, 2],
			[4, 8, 16, 1, 16, 23, 0, 8],
			[5, 4, 18, 0, 24, 27, 6, 10],
			[6, 5, 19, 2, 28, 32, 9, 14],
			[7, 3, 35, 2, 38, 40, 3, 6],
			[8, 4, 34, 0, 34, 37, 0, 4],
			[9, 6, 39, 3, 41, 46, 2, 8],
			[10, 4, 40, 1, 47, 50, 7, 11]
		],

		logs: [0, 0, 0, 0, 0, 1, 1, 1, 2, 2,
			   2, 2, 3, 3, -1, -1, 4, 4, 4, 4,
			   4, 4, 4, 4, 5, 5, 5, 5, 6, 6,
			   6, 6, 6, -1, 8, 8, 8, 8, 7, 7,
			   7, 9, 9, 9, 9, 9, 9, 10, 10, 10, 
			   10]
	},

	RR: {
		quanta: 2,
		
		data: [
			[0, 5, 0, 0, 0, 11, 7, 12],
			[1, 3, 0, 2, 2, 8, 6, 9],
			[2, 4, 0, 1, 4, 10, 7, 11],
			[3, 2, 12, 0, 12, 13, 0, 2],
			[4, 8, 16, 1, 16, 31, 8, 16],
			[5, 4, 18, 0, 18, 25, 4, 8],
			[6, 5, 19, 2, 22, 32, 9, 14],
			[7, 3, 35, 2, 36, 40, 3, 6],
			[8, 4, 34, 0, 34, 39, 2, 6],
			[9, 6, 39, 3, 41, 50, 6, 12],
			[10, 4, 40, 1, 43, 48, 5, 9]
		],

		logs: [0, 0, 1, 1, 2, 2, 0, 0, 1, 2,
			   2, 0, 3, 3, -1, -1, 4, 4, 5, 5,
			   4, 4, 6, 6, 5, 5, 4, 4, 6, 6,
			   4, 4, 6, -1, 8, 8, 7, 7, 8, 8,
			   7, 9, 9, 10, 10, 9, 9, 10, 10, 9,
			   9]
	},

	PriorityNonPreemptive: {
		data: [
			[0, 5, 0, 0, 7, 11, 7, 12],
			[1, 3, 0, 2, 0, 2, 0, 3],
			[2, 4, 0, 1, 3, 6, 3, 7],
			[3, 2, 12, 0, 12, 13, 0, 2],
			[4, 8, 16, 1, 16, 23, 0, 8],
			[5, 4, 18, 0, 29, 32, 11, 15],
			[6, 5, 19, 2, 24, 28, 5, 10],
			[7, 3, 35, 2, 38, 40, 3, 6],
			[8, 4, 34, 0, 34, 37, 0, 4],
			[9, 6, 39, 3, 41, 46, 2, 8],
			[10, 4, 40, 1, 47, 50, 7, 11]
		],

		logs: [1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 
			   0, 0, 3, 3, -1, -1, 4, 4, 4, 4,
			   4, 4, 4, 4, 6, 6, 6, 6, 6, 5,
			   5, 5, 5, -1, 8, 8, 8, 8, 7, 7,
			   7, 9, 9, 9, 9, 9, 9, 10, 10, 10,
			   10]
	},

	PriorityPreemptive: {
		data: [
			[0, 5, 0, 0, 7, 11, 7, 12],
			[1, 3, 0, 2, 0, 2, 0, 3],
			[2, 4, 0, 1, 3, 6, 3, 7],
			[3, 2, 12, 0, 12, 13, 0, 2],
			[4, 8, 16, 1, 16, 28, 5, 13],
			[5, 4, 18, 0, 29, 32, 11, 15],
			[6, 5, 19, 2, 19, 23, 0, 5],
			[7, 3, 35, 2, 35, 37, 0, 3],
			[8, 4, 34, 0, 34, 50, 13, 17],
			[9, 6, 39, 3, 39, 44, 0, 6],
			[10, 4, 40, 1, 45, 48, 5, 9]
		],

		logs: [1, 1, 1, 2, 2, 2, 2, 0, 0, 0,
			   0, 0, 3, 3, -1, -1, 4, 4, 4, 6,
			   6, 6, 6, 6, 4, 4, 4, 4, 4, 5,
			   5, 5, 5, -1, 8, 7, 7, 7, 8, 9,
			   9, 9, 9, 9, 9, 10, 10, 10, 10, 8,
			   8]
	},

	SJF: {
		data: [
			[0, 5, 0, 0, 7, 11, 7, 12],
			[1, 3, 0, 2, 0, 2, 0, 3],
			[2, 4, 0, 1, 3, 6, 3, 7],
			[3, 2, 12, 0, 12, 13, 0, 2],
			[4, 8, 16, 1, 16, 23, 0, 8],
			[5, 4, 18, 0, 24, 27, 6, 10],
			[6, 5, 19, 2, 28, 32, 9, 14],
			[7, 3, 35, 2, 38, 40, 3, 6],
			[8, 4, 34, 0, 34, 37, 0, 4],
			[9, 6, 39, 3, 45, 50, 6, 12],
			[10, 4, 40, 1, 41, 44, 1, 5]
		],

		logs:[1, 1, 1, 2, 2, 2, 2, 0, 0, 0,
			  0, 0, 3, 3, -1, -1, 4, 4, 4, 4,
			  4, 4, 4, 4, 5, 5, 5, 5, 6, 6,
			  6, 6, 6, -1, 8, 8, 8, 8, 7, 7,
			  7, 10, 10, 10, 10, 9, 9, 9, 9, 9,
			  9]
	},

	SRTF: {
		data: [
			[0, 5, 0, 0, 7, 11, 7, 12],
			[1, 3, 0, 2, 0, 2, 0, 3],
			[2, 4, 0, 1, 3, 6, 3, 7],
			[3, 2, 12, 0, 12, 13, 0, 2],
			[4, 8, 16, 1, 16, 32, 9, 17],
			[5, 4, 18, 0, 18, 21, 0, 4],
			[6, 5, 19, 2, 22, 26, 3, 8],
			[7, 3, 35, 2, 38, 40, 3, 6],
			[8, 4, 34, 0, 34, 37, 0, 4],
			[9, 6, 39, 3, 45, 50, 6, 12],
			[10, 4, 40, 1, 41, 44, 1, 5]
		],

		logs: [1, 1, 1, 2, 2, 2, 2, 0, 0, 0,
			   0, 0, 3, 3, -1, -1, 4, 4, 5, 5,
			   5, 5, 6, 6, 6, 6, 6, 4, 4, 4,
			   4, 4, 4, -1, 8, 8, 8, 8, 7, 7,
			   7, 10, 10, 10, 10, 9, 9, 9, 9, 9,
			   9]
	},

	MLQ: {
		data: [
			[0, 3, 0, 0, 0, 2, 0, 3, 0],
			[1, 3, 0, 0, 3, 5, 3, 6, 1],
			[2, 3, 0, 0, 6, 8, 6, 9, 2],
			[3, 5, 10, 0, 10, 25, 11, 16, 1],
			[4, 3, 11, 0, 12, 16, 3, 6, 0],
			[5, 2, 12, 0, 17, 18, 5, 7, 1],
			[6, 2, 14, 2, 14, 15, 0, 2, 0],
			[7, 2, 15, 0, 21, 22, 6, 8, 1],
			[8, 2, 19, 2, 19, 20, 0, 2, 0],
			[9, 4, 26, 0, 26, 31, 2, 6, 2],
			[10, 2, 28, 1, 28, 29, 0, 2, 0]
		],

		logs: [
			0, 0, 0, 1, 1, 1, 2, 2, 2, -1,
			3, 3, 4, 4, 6, 6, 4, 5, 5, 8,
			8, 7, 7, 3, 3, 3, 9, 9, 10, 10,
			9, 9
		],

		map: [
			[[0, 0], [1, 1], [2, 2]],			// 0
			[[0, 0], [1, 1], [2, 2]],			// 1
			[[0, 0], [1, 1], [2, 2]],			// 2
			[[1, 1], [2, 2]],					// 3
			[[1, 1], [2, 2]],					// 4
			[[1, 1], [2, 2]],					// 5
			[[2, 2]],							// 6
			[[2, 2]],							// 7
			[[2, 2]],							// 8
			[],									// 9
			[[3, 1]],							// 10
			[[3, 1], [4, 0]],					// 11
			[[4, 0], [3, 1]],					// 12
			[[4, 0], [3, 1]],					// 13
			[[6, 0], [4, 0], [3, 1]],			// 14
			[[6, 0], [4, 0], [3, 1]],			// 15
			[[4, 0], [3, 1], [7, 1]],			// 16
			[[5, 1], [3, 1], [7, 1]],			// 17
			[[5, 1], [3, 1], [7, 1]],			// 18
			[[8, 0], [3, 1], [7, 1]],			// 19
			[[8, 0], [3, 1], [7, 1]],			// 20
			[[3, 1], [7, 1]],					// 21
			[[3, 1], [7, 1]],					// 22
			[[3, 1]],							// 23
			[[3, 1]],							// 24
			[[3, 1]],							// 25
			[[9, 2]],							// 26
			[[9, 2]],							// 27
			[[10, 0], [9, 2]],					// 28
			[[10, 0], [9, 2]],					// 29
			[[9, 2]],							// 30
			[[9, 2]]							// 31
		]
	},

	MLQPreemptive: {
		data: [
			[0, 3, 0, 0, 0, 2, 0, 3, 0],
			[1, 3, 0, 0, 3, 5, 3, 6, 1],
			[2, 3, 0, 0, 6, 8, 6, 9, 2],
			[3, 5, 10, 0, 10, 25, 11, 16, 1],
			[4, 3, 11, 0, 11, 13, 0, 3, 0],
			[5, 2, 12, 0, 16, 17, 4, 6, 1],
			[6, 2, 14, 2, 14, 15, 0, 2, 0],
			[7, 2, 15, 0, 18, 21, 5, 7, 1],
			[8, 2, 19, 2, 19, 20, 0, 2, 0],
			[9, 4, 26, 0, 26, 31, 2, 6, 2],
			[10, 2, 28, 1, 28, 29, 0, 2, 0]
		],

		logs: [
			0, 0, 0, 1, 1, 1, 2, 2, 2, -1,
			3, 4, 4, 4, 6, 6, 5, 5, 7, 8,
			8, 7, 3, 3, 3, 3, 9, 9, 10, 10,
			9, 9
		],

		map: [
			[[0, 0], [1, 1], [2, 2]],
			[[0, 0], [1, 1], [2, 2]],
			[[0, 0], [1, 1], [2, 2]],
			[[1, 1], [2, 2]],
			[[1, 1], [2, 2]],
			[[1, 1], [2, 2]],
			[[2, 2]],
			[[2, 2]],
			[[2, 2]],
			[],
			[[3, 1]],
			[[4, 0], [3, 1]],
			[[4, 0], [3, 1], [5, 1]],
			[[4, 0], [3, 1], [5, 1]],
			[[6, 0], [3, 1], [5, 1]],
			[[6, 0], [3, 1], [7, 1], [5, 1]],
			[[5, 1], [7, 1], [3, 1]],
			[[5, 1], [7, 1], [3, 1]],
			[[7, 1], [3, 1]],
			[[8, 0], [7, 1], [3, 1]],
			[[8, 0], [7, 1], [3, 1]],
			[[7, 1], [3, 1]],
			[[3, 1]],
			[[3, 1]],
			[[3, 1]],
			[[3, 1]],
			[[9, 2]],
			[[9, 2]],
			[[10, 0], [9, 2]],
			[[10, 0], [9, 2]],
			[[9, 2]],
			[[9, 2]],
		]
	},

	MLFQ: {
		data: [
			[0, 2, 0, 0, 0, 1, 0, 2],
			[1, 4, 0, 0, 2, 7, 4, 8],
			[2, 3, 0, 0, 4, 8, 6, 9],
			[3, 12, 10, 0, 10, 38, 17, 29],
			[4, 2, 11, 0, 12, 13, 1, 3],
			[5, 3, 16, 0, 17, 19, 1, 4],
			[6, 2, 22, 0, 24, 25, 2, 4],
			[7, 10, 23, 0, 26, 35, 3, 13]
		],

		logs: [
			0, 0, 1, 1, 2, 2, 1, 1, 2, -1,
			3, 3, 4, 4, 3, 3, 3, 5, 5, 5,
			3, 3, 3, 3, 6, 6, 7, 7, 7, 7,
			7, 7, 7, 7, 7, 7, 3, 3, 3
		],

		map: [
			[[0, 0], [1, 0], [2, 0]],		// 0
			[[0, 0], [1, 0], [2, 0]],		// 1
			[[1, 0], [2, 0]],				// 2
			[[1, 0], [2, 0]],				// 3
			[[1, 1], [2, 0]],				// 4
			[[1, 1], [2, 0]],				// 5
			[[1, 1], [2, 1]],				// 6
			[[1, 1], [2, 1]],				// 7
			[[2, 1]],						// 8
			[],								// 9
			[[3, 0]],						// 10
			[[3, 0], [4, 0]],				// 11
			[[3, 1], [4, 0]],				// 12
			[[3, 1], [4, 0]],				// 13
			[[3, 1]],						// 14
			[[3, 1]],						// 15
			[[3, 1]],						// 16
			[[3, 2], [5, 0]],				// 17
			[[3, 2], [5, 0]],				// 18
			[[3, 2], [5, 1]],				// 19
			[[3, 2]],						// 20
			[[3, 2]],						// 21
			[[3, 2], [6, 0]],				// 22
			[[3, 2], [6, 0]],				// 23
			[[3, 3], [6, 0]],
			[[3, 3], [6, 0]],
			[[3, 3], [7, 0]],
			[[3, 3], [7, 0]],
			[[3, 3], [7, 1]],
			[[3, 3], [7, 1]],
			[[3, 3], [7, 1]],
			[[3, 3], [7, 2]],
			[[3, 3], [7, 2]],
			[[3, 3], [7, 2]],
			[[3, 3], [7, 2]],
			[[3, 3], [7, 3]],
			[[3, 3]],
			[[3, 3]],
			[[3, 3]]
		]
	},

	MLFQPreemptive: {
		data: [
			[0, 2, 0, 0, 0, 1, 0, 2],
			[1, 4, 0, 0, 2, 7, 4, 8],
			[2, 3, 0, 0, 4, 8, 6, 9],
			[3, 12, 10, 0, 10, 38, 17, 29],
			[4, 2, 11, 0, 12, 13, 1, 3],
			[5, 3, 16, 0, 16, 19, 1, 4],
			[6, 2, 22, 0, 22, 23, 0, 2],
			[7, 10, 23, 0, 24, 35, 3, 13] 
		],

		logs: [
			0, 0, 1, 1, 2, 2, 1, 1, 2, -1,
			3, 3, 4, 4, 3, 3, 5, 5, 3, 5,
			3, 3, 6, 6, 7, 7, 7, 7, 7, 3,
			3, 7, 7, 7, 7, 7, 3, 3, 3
		],

		map: [
			[[0, 0], [1, 0], [2, 0]],		// 0
			[[0, 0], [1, 0], [2, 0]],		// 1
			[[1, 0], [2, 0]],				// 2
			[[1, 0], [2, 0]],				// 3
			[[1, 1], [2, 0]],				// 4
			[[1, 1], [2, 0]],				// 5
			[[1, 1], [2, 1]],				// 6
			[[1, 1], [2, 1]],				// 7
			[[2, 1]],						// 8
			[],								// 9
			[[3, 0]],						// 10
			[[3, 0], [4, 0]],				// 11
			[[3, 1], [4, 0]],				// 12
			[[3, 1], [4, 0]],				// 13
			[[3, 1]],						// 14
			[[3, 1]],						// 15
			[[3, 1], [5, 0]],				// 16
			[[3, 1], [5, 0]],				// 17
			[[3, 1], [5, 1]],				// 18
			[[3, 2], [5, 1]],				// 19
			[[3, 2]],						// 20
			[[3, 2]],						// 21
			[[3, 2], [6, 0]],				// 22
			[[3, 2], [6, 0]],				// 23
			[[3, 2], [7, 0]],				// 24
			[[3, 2], [7, 0]],				// 25
			[[3, 2], [7, 1]],				// 26
			[[3, 2], [7, 1]],				// 27
			[[3, 2], [7, 1]],				// 28
			[[3, 2], [7, 2]],				// 29
			[[3, 2], [7, 2]],				// 30
			[[3, 3], [7, 2]],				// 31
			[[3, 3], [7, 2]],				// 32
			[[3, 3], [7, 2]],
			[[3, 3], [7, 2]],
			[[3, 3], [7, 3]],
			[[3, 3]],
			[[3, 3]],
			[[3, 3]],
		]
	}
};