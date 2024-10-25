'use strict'

class Point {
    x
    y
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
}

class Style {
    styleList = {}
    add = (name, value) => {
        value = value.trim()
        if (!value) {
            this.remove(name)
        }
        else {
            this.styleList[name] = value
        }
    }
    remove = (name) => {
        if (this.styleList[name]) {
            delete this.styleList[name]
        }
    }

    updateValues = (values) => {
        Object.entries(values).map(([name, value]) => {
            this.add(name, value)
        })
    }

    render = () => {
        return Object.entries(this.styleList).map(([key, value]) => {
            return `${key}="${value}"`
        }).join(" ")
    }

    editorRender = () => {
        const fill = this.styleList["fill"] ? this.styleList["fill"] : ""
        const stroke = this.styleList["stroke"] ? this.styleList["stroke"] : ""
        const strokeWidth = this.styleList["stroke-width"] ? this.styleList["stroke-width"] : ""

        return `
        <h6 class="row mx-1 mt-3">Kiểu Loại</h6>
        <div class="row fs-6 align-items-center">
            <label for="styleItem_fill" class="col-6 col-form-label">Màu Nền</label>
            <div class="col-6">
                <input type="text" class="form-control form-control-sm" id="styleItem_fill" name="fill" value="${fill}"/>
            </div>
        </div>
        <div class="row fs-6 align-items-center">
            <label for="styleItem_stroke" class="col-6 col-form-label">Màu Viền</label>
            <div class="col-6">
                <input type="text" class="form-control form-control-sm" id="styleItem_stroke" name="stroke" value="${stroke}"/>
            </div>
        </div>
        <div class="row fs-6 align-items-center">
            <label for="styleItem_stroke-width" class="col-6 col-form-label">Cỡ Viền</label>
            <div class="col-6">
                <input type="text" class="form-control form-control-sm" id="styleItem_stroke-width" name="stroke-width" value="${strokeWidth}"/>
            </div>
        </div>
        `
    }
}

class SVG {
    name = `svg_${Date.now()}`
    shapeList = []
    width = 500
    height = 500
    activeShapeID = null
    nameOrder = 1;

    setActiveShapeID = (shapeID) => {
        this.activeShapeID = parseInt(shapeID)
    }


    updateValues = (values) => {
        this.name = values.name
        this.width = values.width
        this.height = values.height
    }

    moveShapeForward = (shapeID) => {
        shapeID = parseInt(shapeID)
        if (shapeID < this.shapeList.length - 1) {
            const shape = this.getShape(shapeID)
            this.removeShape(shapeID)
            this.shapeList.splice(shapeID + 1, 0, shape)
        }
    }

    moveShapeBackward = (shapeID) => {
        shapeID = parseInt(shapeID)
        if (shapeID > 0) {
            const shape = this.getShape(shapeID)
            this.removeShape(shapeID)
            this.shapeList.splice(shapeID - 1, 0, shape)
        }
    }

    moveShapeFront = (shapeID) => {
        shapeID = parseInt(shapeID)
        if (shapeID < this.shapeList.length - 1) {
            const shape = this.getShape(shapeID)
            this.removeShape(shapeID)
            this.shapeList.push(shape)
        }
    }

    moveShapeBack = (shapeID) => {
        shapeID = parseInt(shapeID)
        if (shapeID > 0) {
            const shape = this.getShape(shapeID)
            this.removeShape(shapeID)
            this.shapeList.unshift(shape)
        }
    }

    removeShape = (shapeID) => {
        shapeID = parseInt(shapeID)
        this.shapeList.splice(shapeID, 1)
    }

    addShape = (shape) => {
        shape.name += ` ${this.nameOrder++}`
        this.shapeList.push(shape)
        this.setActiveShapeID(this.shapeList.length - 1)
    }

    getShape(shapeID) {
        return this.shapeList[shapeID]
    }

    editorAttributesRender = () => {
        return `
        <div class="row fs-6 align-items-center">
            <label for="fileName" class="col-4 col-form-label">Tên File</label>
            <div class="col-5">
                <input type="text" class="form-control form-control-sm" id="fileName" name="name" value="${this.name}" />
            </div>
            <span class="col-3 col-form-label">.svg</span>
        </div>
        <div class="row fs-6 align-items-center">
            <label for="fileWidth" class="col-4 col-form-label">Chiều rộng</label>
            <div class="col-5">
                <input type="text" class="form-control form-control-sm" id="fileWidth" name="width" value="${this.width}" />
            </div>
            <span class="col-3 col-form-label">px</span>
        </div>
        <div class="row fs-6 align-items-center">
            <label for="fileHeight" class="col-4 col-form-label">Chiều Dài</label>
            <div class="col-5">
                <input type="text" class="form-control form-control-sm" id="fileHeight" name="height" value="${this.height}" />
            </div>
            <span class="col-3 col-form-label">px</span>
        </div>
        `
    }

    editorPointsRender = () => {
        let pointsRender = ``
        this.shapeList.forEach((shape, id) => {
            let activeClass = (this.activeShapeID == id) ? "active" : ""
            pointsRender += `
            <div class="svgShapeItem d-flex mb-2 p-1 align-items-center border border-1 rounded g-1 ${activeClass}" id-data="${id}">
                <span class="col-auto me-auto">${shape.name}</span>
                <button class="btn btn-sm btn-danger ms-1 deleteShape" id-data="${id}"><i class="bi bi-trash"></i></button>
                <button class="btn btn-sm btn-success ms-1 moveForwardShape" id-data="${id}"><i class="bi bi-chevron-down"></i></button>
                <button class="btn btn-sm btn-success ms-1 moveBackwardShape" id-data="${id}"><i class="bi bi-chevron-up"></i></button>
                <button class="btn btn-sm btn-primary ms-1 moveFrontShape" id-data="${id}"><i class="bi bi-chevron-double-down"></i></button>
                <button class="btn btn-sm btn-primary ms-1 moveBackShape" id-data="${id}"><i class="bi bi-chevron-double-up"></i></button>
            </div>
        `
        })
        return pointsRender
    }

    visualRender = () => {
        let svg = `<svg width="${this.width}" height="${this.height}" >`
        this.shapeList.forEach((shape, index) => {
            let isActive = (this.activeShapeID === index) ? "active" : ""
            svg += `<g class="visual_shape_item ${isActive}" id-data="${index}">`
            svg += shape.render()
            svg += `</g>`
        })
        svg += `</svg>`

        return svg
    }
    render = () => {
        let svg = `<svg width="${this.width}" height="${this.height}">`
        this.shapeList.forEach(shape => {
            svg += shape.render()
        })
        svg += `</svg>`

        return svg
    }

}

class Shape {
    name = "Shape"
    style = new Style()
    constructor() {
        this.style.add("stroke", "#000")
        this.style.add("fill", "#fff")
        this.style.add("stroke-width", "2")
    }

    updateValuesFromDom = (values) => {
        const dataValues = this.convertDomObjToDataObject(values)
        this.updateValues(dataValues)
    }

    convertDomObjToDataObject = (values) => {
        return values
    }
}

class Rectangle extends Shape {
    name = "Hình Chữ Nhật"
    ltp = new Point(20, 15)
    width = 40
    height = 30

    constructor(x = 10, y = 10, width = 40, height = 30) {
        super()
        this.ltp.x = x
        this.ltp.y = y
        this.width = width
        this.height = height
    }

    updateValues = (values) => {
        this.ltp.x = values.x
        this.ltp.y = values.y
        this.width = values.width
        this.height = values.height
    }

    calMoveAttributes = (svg, deltaX, deltaY) => {
        let minWidth = 0
        let maxWidth = svg.width - this.width

        let minHeight = 0
        let maxHeight = svg.height - this.height

        let tempX = parseInt(this.ltp.x) + parseInt(deltaX)
        let tempY = parseInt(this.ltp.y) + parseInt(deltaY)

        return {
            x: Math.min(Math.max(tempX, minWidth), maxWidth),
            y: Math.min(Math.max(tempY, minHeight), maxHeight)
        }
    }

    render = () => {
        return `
            <rect x="${this.ltp.x}" y="${this.ltp.y}" width="${this.width}" height="${this.height}" ${this.style.render()} />
        `
    }

    editorRender = () => {
        return `
            <h6 class="row mx-1 mt-3">Thuộc Tính</h6>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-x" class="col-6 col-form-label">X</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-x" name="x" value="${this.ltp.x}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-y" class="col-6 col-form-label">Y</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-y" name="y" value="${this.ltp.y}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-width" class="col-6 col-form-label">Rộng</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-width" name="width" value="${this.width}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-height" class="col-6 col-form-label">Cao</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-height" name="height" value="${this.height}"/>
                </div>
            </div>
        `
    }
}

class Circle extends Shape {
    name = "Hình Tròn"
    cp = new Point(20, 20)
    r = 20

    constructor(cx = 20, cy = 20, r = 20) {
        super()
        this.cp.x = cx
        this.cp.y = cy
        this.r = r
    }

    updateValues = (values) => {
        this.cp.x = values.cx
        this.cp.y = values.cy
        this.r = values.r
    }

    calMoveAttributes = (svg, deltaX, deltaY) => {
        let minWidth = this.r
        let maxWidth = svg.width - this.r

        let minHeight = this.r
        let maxHeight = svg.height - this.r

        let tempX = parseInt(this.cp.x) + parseInt(deltaX)
        let tempY = parseInt(this.cp.y) + parseInt(deltaY)

        return {
            cx: Math.min(Math.max(tempX, minWidth), maxWidth),
            cy: Math.min(Math.max(tempY, minHeight), maxHeight)
        }
    }

    render = () => {
        return `
            <circle cx="${this.cp.x}" cy="${this.cp.y}" r="${this.r}" ${this.style.render()} />
        `
    }

    editorRender = () => {
        return `
            <h6 class="row mx-1 mt-3">Thuộc Tính</h6>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-cx" class="col-6 col-form-label">CX</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-cx" name="cx" value="${this.cp.x}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-cy" class="col-6 col-form-label">CY</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-cy" name="cy" value="${this.cp.y}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-r" class="col-6 col-form-label">Bán kính</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-r" name="r" value="${this.r}"/>
                </div>
            </div>
        `
    }
}

class Ellipse extends Shape {
    name = "Hình Elip"
    cp = new Point(30, 30)
    rx = 30
    ry = 20

    constructor(cx = 30, cy = 30, rx = 30, ry = 20) {
        super()
        this.cp.x = cx
        this.cp.y = cy
        this.rx = rx
        this.ry = ry

    }

    updateValues = (values) => {
        this.cp.x = values.cx
        this.cp.y = values.cy
        this.rx = values.rx
        this.ry = values.ry
    }

    calMoveAttributes = (svg, deltaX, deltaY) => {
        let minWidth = this.rx
        let maxWidth = svg.width - this.rx

        let minHeight = this.ry
        let maxHeight = svg.height - this.ry

        let tempX = parseInt(this.cp.x) + parseInt(deltaX)
        let tempY = parseInt(this.cp.y) + parseInt(deltaY)

        return {
            cx: Math.min(Math.max(tempX, minWidth), maxWidth),
            cy: Math.min(Math.max(tempY, minHeight), maxHeight)
        }
    }

    render = () => {
        return `
            <ellipse cx="${this.cp.x}" cy="${this.cp.y}" rx="${this.rx}" ry="${this.ry}" ${this.style.render()} />
        `
    }

    editorRender = () => {
        return `
            <h6 class="row mx-1 mt-3">Thuộc Tính</h6>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-cx" class="col-6 col-form-label">CX</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-cx" name="cx" value="${this.cp.x}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-cy" class="col-6 col-form-label">CY</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-cy" name="cy" value="${this.cp.y}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-rx" class="col-6 col-form-label">Bán kính X</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-rx" name="rx" value="${this.rx}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-ry" class="col-6 col-form-label">Bán kính Y</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-ry" name="ry" value="${this.ry}"/>
                </div>
            </div>
        `
    }
}

class LineShape extends Shape {
    calBoundValue(boundCoords, x, y) {
        boundCoords.minX = x < boundCoords.minX ? x : boundCoords.minX
        boundCoords.maxX = x > boundCoords.maxX ? x : boundCoords.maxX
        boundCoords.minY = y < boundCoords.minY ? y : boundCoords.minY
        boundCoords.maxY = y > boundCoords.maxY ? y : boundCoords.maxY
    }

    isChangedSize(originBoundCoords, movedBoundCoords) {

        const originWidth = originBoundCoords.maxX - originBoundCoords.minX;
        const originHeight = originBoundCoords.maxY - originBoundCoords.minY;

        const movedWidth = movedBoundCoords.maxX - movedBoundCoords.minX;
        const movedHeight = movedBoundCoords.maxY - movedBoundCoords.minY;

        if (movedWidth !== originWidth || movedHeight !== originHeight) {
            return true
        }
        return false
    }
}

class Line extends LineShape {
    name = "Đường Thẳng"

    p1 = new Point(0, 0)
    p2 = new Point(30, 30)

    constructor(x1 = 0, y1 = 0, x2 = 30, y2 = 30) {
        super()
        this.p1.x = x1
        this.p1.y = y1
        this.p2.x = x2
        this.p2.y = y2
    }

    updateValues = (values) => {
        this.p1.x = values.x_1
        this.p1.y = values.y_1
        this.p2.x = values.x_2
        this.p2.y = values.y_2
    }

    convertDomObjToDataObject = (values) => {
        const dataValues = {}
        dataValues.x_1 = values.x1
        dataValues.y_1 = values.y1
        dataValues.x_2 = values.x2
        dataValues.y_2 = values.y2
        return dataValues
    }

    calMoveAttributes = (svg, deltaX, deltaY) => {
        let minWidth = 0
        let maxWidth = svg.width

        let minHeight = 0
        let maxHeight = svg.height

        let pointList = [this.p1, this.p2]

        const originBoundCoords = {
            minX: parseInt(svg.width),
            maxX: 0,
            minY: parseInt(svg.height),
            maxY: 0
        }
        const movedBoundCoords = {
            minX: parseInt(svg.width),
            maxX: 0,
            minY: parseInt(svg.height),
            maxY: 0
        }
        const changedAttributes = {}

        pointList.forEach((value, index) => {
            let tempX = parseInt(value.x) + parseInt(deltaX)
            let tempY = parseInt(value.y) + parseInt(deltaY)

            let resultX = Math.min(Math.max(tempX, minWidth), maxWidth)
            let resultY = Math.min(Math.max(tempY, minHeight), maxHeight)


            changedAttributes[`x${index + 1}`] = resultX
            changedAttributes[`y${index + 1}`] = resultY

            this.calBoundValue(originBoundCoords, parseInt(value.x), parseInt(value.y))
            this.calBoundValue(movedBoundCoords, resultX, resultY)
        })

        return (!this.isChangedSize(originBoundCoords, movedBoundCoords)) ? changedAttributes : {}
    }

    render = () => {
        return `
            <line x1="${this.p1.x}" y1="${this.p1.y}" x2="${this.p2.x}" y2="${this.p2.y}" ${this.style.render()} />
        `
    }

    editorRender = () => {
        return `
            <h6 class="row mx-1 mt-3">Thuộc Tính</h6>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-x_1" class="col-6 col-form-label">X1</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-x_1" name="x_1" value="${this.p1.x}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-y_1" class="col-6 col-form-label">Y1</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-y_1" name="y_1" value="${this.p1.y}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-rx" class="col-6 col-form-label">X2</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-rx" name="x_2" value="${this.p2.x}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-y_2" class="col-6 col-form-label">Y2</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-y_2" name="y_2" value="${this.p2.y}"/>
                </div>
            </div>
        `
    }
}

class PolyShape extends LineShape {
    points = []

    addPoint = (x, y) => {
        this.points.push(new Point(x, y))
    }
    removePoint = (pointID) => {
        this.points.splice(pointID, 1)
    }

    updateValues = (values) => {
        for (let i = values.x.length - 1; i >= 0; i--) {
            if (values.x[i] === "" && values.y[i] === "") {
                values.x.splice(i, 1)
                values.y.splice(i, 1)
            }
        }
        values.x.forEach((value, index) => {
            if (!this.points[index]) {
                this.addPoint(0, 0)
            }
            this.points[index].x = value ? value : 0
        })
        values.y.forEach((value, index) => {
            this.points[index].y = value ? value : 0
        })
    }

    convertDomObjToDataObject = (values) => {
        const dataValues = {
            x: [],
            y: []
        }

        values.points.split(" ").forEach((value) => {
            let valueArr = value.split(",")
            dataValues.x.push(valueArr[0])
            dataValues.y.push(valueArr[1])
        })

        return dataValues
    }

    calMoveAttributes = (svg, deltaX, deltaY) => {
        let minWidth = 0
        let maxWidth = svg.width

        let minHeight = 0
        let maxHeight = svg.height

        const originBoundCoords = {
            minX: parseInt(svg.width),
            maxX: 0,
            minY: parseInt(svg.height),
            maxY: 0
        }
        const movedBoundCoords = {
            minX: parseInt(svg.width),
            maxX: 0,
            minY: parseInt(svg.height),
            maxY: 0
        }
        const changedAttributes = {}
        const points = []

        this.points.forEach((value, index) => {

            let tempX = parseInt(value.x) + parseInt(deltaX)
            let tempY = parseInt(value.y) + parseInt(deltaY)

            let resultX = Math.min(Math.max(tempX, minWidth), maxWidth)
            let resultY = Math.min(Math.max(tempY, minHeight), maxHeight)

            points.push(`${resultX},${resultY}`)

            this.calBoundValue(originBoundCoords, parseInt(value.x), parseInt(value.y))
            this.calBoundValue(movedBoundCoords, resultX, resultY)
        })

        if (!this.isChangedSize(originBoundCoords, movedBoundCoords)) {
            changedAttributes.points = points.join(" ")
        }
        return changedAttributes
    }

    editorRender = () => {
        let render = `
            <h6 class="rows d-flex mx-1 mt-3 align-items-center ">
                <span>Thuộc Tính</span>
                <button type="button" class="btn btn-sm btn-primary addMorePoint ms-auto"><i class="bi bi-plus"></i></button>
            </h6>
            <div id="pointsItemList">
        `;
        this.points.forEach((value, index) => {
            render += this.editorPointRender(index, value.x, value.y)
        })

        render += `
            </div>
        `;

        return render
    }

    editorPointRender = (id, x = "", y = "") => {
        return `
        <div class="pointItem rows fs-6 d-flex align-items-center mx-1 g-1" >
            <label for="attributeItem-x_${id + 1}" class="col-2 col-form-label">P${id + 1}</label>
            <div class="col-4">
                <input type="text" class="form-control form-control-sm" id="attributeItem-x_${id + 1}" name="x[]" value="${x}" />
            </div>
            <div class="col-4">
                <input type="text" class="form-control form-control-sm" id="attributeItem-y_${id + 1}" name="y[]" value="${y}"/>
            </div>
            <div class="col-2 fs-6">
                <span class="btn btn-sm btn-danger deletePointItem" id-data="${id}"><i class="bi bi-trash"></i></span>
            </div>
        </div>
        `
    }
}
class Polygon extends PolyShape {
    name = "Đa Giác"

    constructor(x1 = 30, y1 = 10, x2 = 50, y2 = 40, x3 = 10, y3 = 40) {
        super()
        this.addPoint(x1, y1)
        this.addPoint(x2, y2)
        this.addPoint(x3, y3)
    }
    render = () => {
        const pointsRender = this.points.map(value => { return `${value.x},${value.y}` }).join(" ")
        return `
            <polygon points="${pointsRender}" ${this.style.render()} />
        `
    }
}

class Polyline extends PolyShape {
    name = "Đa Tuyến"

    constructor(x1 = 10, y1 = 40, x2 = 30, y2 = 10, x3 = 50, y3 = 40) {
        super()
        this.addPoint(x1, y1)
        this.addPoint(x2, y2)
        this.addPoint(x3, y3)
    }
    render = () => {
        const pointsRender = this.points.map(value => { return `${value.x},${value.y}` }).join(" ")
        return `
            <polyline points="${pointsRender}" ${this.style.render()} />
        `
    }
}

class Text extends Shape {
    name = "Đoạn Văn"

    ltp = new Point(20, 15)
    text = "text here"
    fontSize = 13
    rotate = 0
    wholeRotate = 0


    constructor(x = 10, y = 10, text = "text here") {
        super()
        this.ltp.x = x
        this.ltp.y = y
        this.text = text

        this.style.add("stroke", "#000")
        this.style.add("fill", "#000")
        this.style.add("stroke-width", "0")
    }

    updateValues = (values) => {
        this.ltp.x = values.x
        this.ltp.y = values.y
        if (values.text !== undefined) {
            this.text = values.text
        }
        if (values.fontSize !== undefined) {
            this.fontSize = parseInt(values.fontSize)
        }
        if (values.rotate !== undefined) {
            this.rotate = parseInt(values.rotate)
        }
        if (values.wholeRotate !== undefined) {
            this.wholeRotate = parseInt(values.wholeRotate)
        }
    }

    calMoveAttributes = (svg, deltaX, deltaY) => {
        let minWidth = 0
        let maxWidth = svg.width - 10

        let minHeight = 0
        let maxHeight = svg.height - 10

        let tempX = parseInt(this.ltp.x) + parseInt(deltaX)
        let tempY = parseInt(this.ltp.y) + parseInt(deltaY)
        const changeAttriButes = {
            x: Math.min(Math.max(tempX, minWidth), maxWidth),
            y: Math.min(Math.max(tempY, minHeight), maxHeight)
        }

        if (this.wholeRotate) {
            changeAttriButes.transform = `rotate(${this.wholeRotate} ${changeAttriButes.x},${changeAttriButes.y})`
        }

        return changeAttriButes
    }

    render = () => {

        let extendAttrButesRender = ``
        extendAttrButesRender += (this.fontSize) ? `font-size="${this.fontSize}"` : ``
        extendAttrButesRender += (this.rotate) ? `rotate="${this.rotate}"` : ``
        extendAttrButesRender += (this.wholeRotate) ? `transform="rotate(${this.wholeRotate} ${this.ltp.x},${this.ltp.y})"` : ``

        return `
            <text x="${this.ltp.x}" y="${this.ltp.y}" ${extendAttrButesRender} ${this.style.render()} >${this.text}</text>
        `
    }

    editorRender = () => {
        return `
            <h6 class="row mx-1 mt-3">Thuộc Tính</h6>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-text" class="col-6 col-form-label">Chữ</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-text" name="text" value="${this.text}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-x" class="col-6 col-form-label">X</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-x" name="x" value="${this.ltp.x}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-y" class="col-6 col-form-label">Y</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-y" name="y" value="${this.ltp.y}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-fontSize" class="col-6 col-form-label">Cỡ Chữ</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-fontSize" name="fontSize" value="${this.fontSize}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-rotate" class="col-6 col-form-label">Quay Chữ</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-rotate" name="rotate" value="${this.rotate}"/>
                </div>
            </div>
            <div class="row fs-6 align-items-center">
                <label for="attributeItem-wholeRotate" class="col-6 col-form-label">Quay Khung</label>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" id="attributeItem-fontSize" name="wholeRotate" value="${this.wholeRotate}"/>
                </div>
            </div>
        `
    }
}