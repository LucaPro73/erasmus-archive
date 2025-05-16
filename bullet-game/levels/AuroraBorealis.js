/** @type {typeof obstacleState} */
const stage = [
    [4, {
        x: width - 40,
        y: 10,
        height: height - 20,
        width: 30,
        moveSpeed: -5,
    }],
    [8, {
        x: 10,
        y: 10,
        height: 20,
        width: width / 3 * 2,
        moveSpeed: 5,
        moveSideways: true,
    }],
    [12, {
        x: width - 100 - 60,
        y: height / 4 - 20,
        height: 120,
        width: 120,
        moveSpeed: -5

    }],
    [13, {
        x: 100,
        y: height / 2 - 20,
        height: 120,
        width: 120,
        moveSpeed: 5
    }],
    [14, {
        x: width - 100 - 60,
        y: height / 4 * 3 - 20,
        height: 120,
        width: 120,
        moveSpeed: -5
    }],
    [16, {
        x: 100,
        y: height - 350,
        width: 20,
        height: 600,
        angle: degToRad(-45),
        moveSpeed: 8
    }],
    [16, {
        x: width - 100,
        y: height - 350,
        width: 20,
        height: 600,
        angle: degToRad(45),
        moveSpeed: -8
    }],
    [18, {
        x: 200,
        y: height - 150,
        width: 20,
        height: 600,
        angle: degToRad(-45),
        moveSpeed: 8
    }],
    [18, {
        x: width - 200,
        y: height - 150,
        width: 20,
        height: 600,
        angle: degToRad(45),
        moveSpeed: -8
    }],
    [20, {
        x: 100,
        y: -250,
        width: 20,
        height: 600,
        angle: degToRad(45),
        moveSpeed: 8
    }],
    [20, {
        x: width - 100,
        y: -250,
        width: 20,
        height: 600,
        angle: degToRad(-45),
        moveSpeed: -8
    }],
    [22, {
        x: 200,
        y: -50,
        width: 20,
        height: 600,
        angle: degToRad(45),
        moveSpeed: 8
    }],
    [22, {
        x: width - 200,
        y: -50,
        width: 20,
        height: 600,
        angle: degToRad(-45),
        moveSpeed: -8
    }],
    [24, {
        x: 100,
        y: height - 50,
        width: 20,
        height: 20,
        moveSpeed: -6.5,
        moveSideways: true,
        repeatCount: 12,
        repeatDirection: "x",
        repeatDistance: 150
    }],
    [26, {
        x: 140,
        y: 50,
        width: 20,
        height: 20,
        moveSpeed: 6.5,
        moveSideways: true,
        repeatCount: 12,
        repeatDirection: "x",
        repeatDistance: 150
    }],
    [28, {
        x: 20,
        y: 20,
        width: 20,
        height: 50,
        moveSpeed: 6.5,
        repeatCount: 8,
        repeatDirection: "y",
        repeatDistance: 150
    }],
    [30, {
        x: width - 20,
        y: 60,
        width: 20,
        height: 50,
        moveSpeed: -6.5,
        repeatCount: 8,
        repeatDirection: "y",
        repeatDistance: 150
    }],
    [32, {
        x: 20,
        y: height - 30,
        height: 20,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [32, {
        x: width - 100 - 60,
        y: height / 5 - 30,
        height: 70,
        width: 70,
        moveSpeed: -5,
        repeatCount: 2,
        repeatDirection: "y",
        repeatDistance: height / 5 * 2
    }],
    [34, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [34, {
        x: 100,
        y: height / 5 * 2 - 30,
        height: 70,
        width: 70,
        moveSpeed: 5,
        repeatCount: 2,
        repeatDirection: "y",
        repeatDistance: height / 5 * 2
    }],
    [36, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [36, {
        x: width - 100 - 60,
        y: height / 5 + 10,
        height: 70,
        width: 70,
        moveSpeed: -5,
        repeatCount: 2,
        repeatDirection: "y",
        repeatDistance: height / 5 * 2
    }],
    [38, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [38, {
        x: 100,
        y: height / 5 * 2 + 10,
        height: 70,
        width: 70,
        moveSpeed: 5,
        repeatCount: 2,
        repeatDirection: "y",
        repeatDistance: height / 5 * 2
    }],
    [40, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [40, {
        x: 40,
        y: 10,
        height: height - 20,
        width: 25,
        moveSpeed: 3,
    }],
    [42, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [44, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [44, {
        x: width - 40,
        y: 10,
        height: height - 20,
        width: 25,
        moveSpeed: -3,
        lifespan: 4
    }],
    [46, {
        x: 20,
        y: height - 40,
        height: 10,
        width: width - 40,
        moveSpeed: -5,
        moveSideways: true,
    }],
    [48, {
        x: 0,
        y: height / 2 - 40,
        height: 80,
        width: width,
        lifespan: 7
    }],
    [50, {
        x: 0,
        y: height / 2 - 80,
        height: 160,
        width: width,
        lifespan: 4
    }],
    [52, {
        x: width / 5 - 10,
        y: 0,
        height: height,
        width: 20,
        lifespan: 2
    }],
    [52.5, {
        x: width / 5 * 2 - 10,
        y: 0,
        height: height,
        width: 20,
        lifespan: 1.5
    }],
    [53, {
        x: width / 5 * 3 - 10,
        y: 0,
        height: height,
        width: 20,
        lifespan: 1
    }],
    [53.5, {
        x: width / 5 * 4 - 10,
        y: 0,
        height: height,
        width: 20,
        lifespan: 0.5
    }],
    [56, {
        x: width / 2 - 120,
        y: height / 2 - 120,
        width: 240,
        height: 240,
        lifespan: 4
    }],
    [57, {
        x: width / 2 - 15,
        y: 0,
        width: 30,
        height: height,
        lifespan: 3
    }],
    [57, {
        x: 0,
        y: height / 2 - 15,
        width: width,
        height: 30,
        lifespan: 3
    }],
    [58, {
        x: width / 2 - 15,
        y: -height * 0.5,
        width: 30,
        height: height * 2,
        angle: degToRad(45),
        lifespan: 2
    }],
    [58, {
        x: width / 2 - 15,
        y: -height * 0.5,
        width: 30,
        height: height * 2,
        angle: degToRad(-45),
        lifespan: 2
    }],
    [60, {
        x: width / 2 - 120,
        y: height / 2 - 120,
        width: 240,
        height: 240,
        moveSpeed: 3,
        windup: 0
    }],
    [60, {
        x: width / 2 - 15,
        y: 0,
        width: 30,
        height: height,
        moveSpeed: 3,
        windup: 0
    }],
    [60, {
        x: -width,
        y: height / 2 - 15,
        width: width * 2,
        height: 30,
        moveSpeed: 3,
        windup: 0,
        lifespan: 10
    }],
    [62, {
        x: 0,
        y: height / 4 - 15,
        width: width,
        height: 30,
        lifespan: 8
    }],
    [63, {
        x: 0,
        y: height / 4 * 3 - 15,
        width: width,
        height: 30,
        lifespan: 7
    }],
    [64, {
        x: width / 4 - 80,
        y: 0,
        width: 200,
        height: height,
        moveSpeed: 0,
    }],
    [66, {
        x: width / 4 * 2 - 80,
        y: 0,
        width: 200,
        height: height,
        moveSpeed: 0,
        lifespan: 5
    }],
    [68, {
        x: width / 4 * 3 - 80,
        y: 0,
        width: 200,
        height: height,
        moveSpeed: 0,
        lifespan: 4
    }],
    [72, {
        x: -50,
        y: height - 200,
        width: 250,
        height: 400,
        angle: degToRad(-50),
        repeatCount: 5,
        repeatDirection: "x",
        repeatDistance: 500
    }],
    [74, {
        x: -50,
        y: -200,
        width: 250,
        height: 400,
        angle: degToRad(50),
        repeatCount: 5,
        repeatDirection: "x",
        repeatDistance: 500,
        lifespan: 6
    }],
    [76, {
        x: 0,
        y: height / 2 - 40,
        height: 80,
        width: width,
        lifespan: 4
    }],
    [78, {
        x: 0,
        y: height / 2 - 80,
        height: 160,
        width: width,
        lifespan: 4
    }],
    /*let str = ""
for(let i = 82; i < 94; i += 0.25) {
    str += `[${i}, {
        x: width / 20 * ${Math.floor((Math.random() + Math.random()) / 2 * 20)},
        y: height / 10 * ${Math.floor((Math.random() + Math.random()) / 2 * 10)},
        height: 80,
        width: 80,
        lifespan: 4
    }],\n`
}
copy(str)*/
    [82, {
        x: width / 20 * 8,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [82.25, {
        x: width / 20 * 9,
        y: height / 10 * 8,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [82.5, {
        x: width / 20 * 11,
        y: height / 10 * 8,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [82.75, {
        x: width / 20 * 14,
        y: height / 10 * 2,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [83, {
        x: width / 20 * 11,
        y: height / 10 * 7,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [83.25, {
        x: width / 20 * 6,
        y: height / 10 * 2,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [83.5, {
        x: width / 20 * 14,
        y: height / 10 * 4,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [83.75, {
        x: width / 20 * 7,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [84, {
        x: width / 20 * 3,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [84.25, {
        x: width / 20 * 16,
        y: height / 10 * 2,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [84.5, {
        x: width / 20 * 9,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [84.75, {
        x: width / 20 * 19,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [85, {
        x: width / 20 * 12,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [85.25, {
        x: width / 20 * 8,
        y: height / 10 * 4,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [85.5, {
        x: width / 20 * 9,
        y: height / 10 * 2,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [85.75, {
        x: width / 20 * 11,
        y: height / 10 * 4,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [86, {
        x: width / 20 * 6,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [86.25, {
        x: width / 20 * 4,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [86.5, {
        x: width / 20 * 9,
        y: height / 10 * 4,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [86.75, {
        x: width / 20 * 14,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [87, {
        x: width / 20 * 6,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [87.25, {
        x: width / 20 * 7,
        y: height / 10 * 2,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [87.5, {
        x: width / 20 * 14,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [87.75, {
        x: width / 20 * 14,
        y: height / 10 * 1,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [88, {
        x: width / 20 * 10,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [88.25, {
        x: width / 20 * 8,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [88.5, {
        x: width / 20 * 10,
        y: height / 10 * 4,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [88.75, {
        x: width / 20 * 12,
        y: height / 10 * 2,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [89, {
        x: width / 20 * 1,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [89.25, {
        x: width / 20 * 7,
        y: height / 10 * 4,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [89.5, {
        x: width / 20 * 14,
        y: height / 10 * 8,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [89.75, {
        x: width / 20 * 8,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [90, {
        x: width / 20 * 11,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [90.25, {
        x: width / 20 * 10,
        y: height / 10 * 8,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [90.5, {
        x: width / 20 * 6,
        y: height / 10 * 0,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [90.75, {
        x: width / 20 * 10,
        y: height / 10 * 7,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [91, {
        x: width / 20 * 3,
        y: height / 10 * 0,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [91.25, {
        x: width / 20 * 18,
        y: height / 10 * 9,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [91.5, {
        x: width / 20 * 13,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [91.75, {
        x: width / 20 * 12,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [92, {
        x: width / 20 * 5,
        y: height / 10 * 6,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [92.25, {
        x: width / 20 * 5,
        y: height / 10 * 3,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [92.5, {
        x: width / 20 * 10,
        y: height / 10 * 0,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [92.75, {
        x: width / 20 * 9,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [93, {
        x: width / 20 * 13,
        y: height / 10 * 7,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [93.25, {
        x: width / 20 * 13,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [93.5, {
        x: width / 20 * 17,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    [93.75, {
        x: width / 20 * 3,
        y: height / 10 * 5,
        height: 80,
        width: 80,
        lifespan: 4
    }],
    // == cubes end ==
    [96, {
        x: width / 2 - 40,
        y: 0,
        width: 80,
        height: height,
        lifespan: 3
    }],
    [100, {
        x: width / 2 - 40,
        y: 0,
        width: 80,
        height: height,
        lifespan: 3
    }],
    [104, {
        x: width / 2 - 40,
        y: 0,
        width: 80,
        height: height,
        lifespan: 3
    }],
    [104, {
        x: 0,
        y: height / 2 - 40,
        width: width,
        height: 80,
        lifespan: 3
    }],
    [108, {
        x: width / 2 - 40,
        y: 0,
        width: 80,
        height: height,
        lifespan: 3
    }],
    [108, {
        x: 0,
        y: height / 3 - 40,
        width: width,
        height: 80,
        lifespan: 3
    }],
    [108, {
        x: 0,
        y: height / 3 * 2 - 40,
        width: width,
        height: 80,
        lifespan: 3
    }],
    /*
    let str = ""
for(let i = 97; i < 111; i+=0.5) {
    str += `[${i}, {
        x: width / 2 - 55 - ${(i - 97) * 60},
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [${i}, {
        x: width / 2 + 40 + ${(i - 97) * 60},
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],\n`
}
copy(str)*/
    [97, {
        x: width / 2 - 55 - 0,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [97, {
        x: width / 2 + 40 + 0,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [97.5, {
        x: width / 2 - 55 - 30,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [97.5, {
        x: width / 2 + 40 + 30,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [98, {
        x: width / 2 - 55 - 60,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [98, {
        x: width / 2 + 40 + 60,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [98.5, {
        x: width / 2 - 55 - 90,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [98.5, {
        x: width / 2 + 40 + 90,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [99, {
        x: width / 2 - 55 - 120,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [99, {
        x: width / 2 + 40 + 120,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [99.5, {
        x: width / 2 - 55 - 150,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [99.5, {
        x: width / 2 + 40 + 150,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [100, {
        x: width / 2 - 55 - 180,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [100, {
        x: width / 2 + 40 + 180,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [100.5, {
        x: width / 2 - 55 - 210,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [100.5, {
        x: width / 2 + 40 + 210,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [101, {
        x: width / 2 - 55 - 240,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [101, {
        x: width / 2 + 40 + 240,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [101.5, {
        x: width / 2 - 55 - 270,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [101.5, {
        x: width / 2 + 40 + 270,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [102, {
        x: width / 2 - 55 - 300,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [102, {
        x: width / 2 + 40 + 300,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [102.5, {
        x: width / 2 - 55 - 330,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [102.5, {
        x: width / 2 + 40 + 330,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [103, {
        x: width / 2 - 55 - 360,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [103, {
        x: width / 2 + 40 + 360,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [103.5, {
        x: width / 2 - 55 - 390,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [103.5, {
        x: width / 2 + 40 + 390,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [104, {
        x: width / 2 - 55 - 420,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [104, {
        x: width / 2 + 40 + 420,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [104.5, {
        x: width / 2 - 55 - 450,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [104.5, {
        x: width / 2 + 40 + 450,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [105, {
        x: width / 2 - 55 - 480,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [105, {
        x: width / 2 + 40 + 480,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [105.5, {
        x: width / 2 - 55 - 510,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [105.5, {
        x: width / 2 + 40 + 510,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [106, {
        x: width / 2 - 55 - 540,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [106, {
        x: width / 2 + 40 + 540,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [106.5, {
        x: width / 2 - 55 - 570,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [106.5, {
        x: width / 2 + 40 + 570,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [107, {
        x: width / 2 - 55 - 600,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [107, {
        x: width / 2 + 40 + 600,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [107.5, {
        x: width / 2 - 55 - 630,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [107.5, {
        x: width / 2 + 40 + 630,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [108, {
        x: width / 2 - 55 - 660,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [108, {
        x: width / 2 + 40 + 660,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [108.5, {
        x: width / 2 - 55 - 690,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [108.5, {
        x: width / 2 + 40 + 690,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [109, {
        x: width / 2 - 55 - 720,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [109, {
        x: width / 2 + 40 + 720,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [109.5, {
        x: width / 2 - 55 - 750,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [109.5, {
        x: width / 2 + 40 + 750,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [110, {
        x: width / 2 - 55 - 780,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [110, {
        x: width / 2 + 40 + 780,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [110.5, {
        x: width / 2 - 55 - 810,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
    [110.5, {
        x: width / 2 + 40 + 810,
        y: 0,
        width: 15,
        height: height,
        lifespan: 2
    }],
]

export const level = {
    name: "Aurora Borealis",
    artist: "Chipzel",
    audio: {
        buffer: null,
        source: context.createBufferSource(),
        gainNode: context.createGain(),
        startTime: 0,
        pausedAt: 0,
        playing: false
    },
    bpm: 72,
    stage,
    length: 94000
}

fetch("./assets/Aurora Borealis - Chipzel (youtube, 0rBvl_1vQYE).mp3")
    .then(r => r.arrayBuffer())
    .then(b => context.decodeAudioData(b))
    .then(d => {
        level.audio.buffer = d;
    });