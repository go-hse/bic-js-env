import { hasMethods } from "./utils.mjs"

const background = "#fff";
export function Layout() {
    let x, y, width, height, sum_of_children_weights = 1;
    const children = [];

    function addChild(item, weight = 1) {
        if (hasMethods(item, ["set"])) {
            children.push({ item, weight });
            sum_of_children_weights = children.reduce((acc, i) => acc += i.weight, 0);
        } else {
            console.log("layout.addChild cannot add", item);
        }
    }

    function set(nx, ny, nw, nh) {
        x = nx; y = ny; width = nw; height = nh;
    }

    return { addChild, set, children: (cb) => children.forEach(cb), weights: () => sum_of_children_weights };
}

export function HorizontalLayout() {
    const base = Layout();
    function set(nx, ny, nw, nh) {
        base.set(nx, ny, nw, nh);
        let itemX = 0;
        base.children(child => {
            const itemWidth = nw * child.weight / base.weights();
            child.item.set(nx + itemX, ny, itemWidth, nh);
            itemX += itemWidth;
        });
    }
    return { set, addChild: base.addChild };
}

export function VerticalLayout() {
    const base = Layout();
    function set(nx, ny, nw, nh) {
        base.set(nx, ny, nw, nh);
        let itemY = 0;
        base.children(child => {
            const itemHeight = nh * child.weight / base.weights();
            child.item.set(nx, ny + itemY, nw, itemHeight);
            itemY += itemHeight;
        });
    }
    return { set, addChild: base.addChild };
}


export function ToggleLayout(minAspectRatio = 1) {
    const hor = HorizontalLayout();
    const ver = VerticalLayout();

    let drawHorizontal = true;

    function set(nx, ny, nw, nh) {
        drawHorizontal = nw > nh * minAspectRatio;
        if (drawHorizontal)
            hor.set(nx, ny, nw, nh);
        else
            ver.set(nx, ny, nw, nh);
    }

    function draw() {
        if (drawHorizontal)
            hor.draw();
        else
            ver.draw();
    }

    function addChild(item, weight = 1) {
        hor.addChild(item, weight);
        ver.addChild(item, weight);
    }

    return { set, addChild, draw };
}


export function BaseLayout(wmgr, editorId, outputId, jsonId, commandsId, selectId) {

    const mainLayout = HorizontalLayout();
    const centerLayout = VerticalLayout();

    mainLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(editorId, nx, ny, nw, nh);
        }
    }, 3);

    mainLayout.addChild(centerLayout, 2);

    mainLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(selectId, nx, ny, nw, nh);
        }
    }, 1);


    centerLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(outputId, nx, ny, nw, nh);
        }
    }, 1);

    centerLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(jsonId, nx, ny, nw, nh);
        }
    }, 1);

    centerLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(commandsId, nx, ny, nw, nh);
        }
    }, 1);

    function set(nx, ny, nw, nh) {
        wmgr.show(commandsId);
        wmgr.show(selectId);
        mainLayout.set(nx, ny, nw, nh)
    }

    return { set };

}


export function ReducedLayout(wmgr, editorId, outputId, jsonId, commandsId, selectId) {
    const mainLayout = HorizontalLayout();
    const centerLayout = VerticalLayout();

    mainLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(editorId, nx, ny, nw, nh);
        }
    }, 3);

    mainLayout.addChild(centerLayout, 2);

    centerLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(outputId, nx, ny, nw, nh);
        }
    }, 1);

    centerLayout.addChild({
        set: (nx, ny, nw, nh) => {
            wmgr.set(jsonId, nx, ny, nw, nh);
        }
    }, 1);


    function set(nx, ny, nw, nh) {
        wmgr.hide(commandsId);
        wmgr.hide(selectId);
        mainLayout.set(nx, ny, nw, nh)
    }

    return { set };
}

