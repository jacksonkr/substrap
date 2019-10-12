class Substrap {
    constructor(timer = 100) {
        if (Substrap.instance !== null) {
            console.warn("An instance of Substrap is already running! Returning `Substrap.instance`.");
            return Substrap.instance;
        }

        setInterval(() => {
            if (this._watchObjects && this._watchObjects.length) this._watchObjects.forEach(Substrap.processSub);
        }, timer);

        return Substrap.instance = this;
    }

    static instance = null;
    static sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    _watchObjects = [];

    static processSub(obj) {
        // console.log(obj);
        const element = document.getElementById(obj.elementId);
        if (!element) return;

        let size = Substrap.sizes[0];
        // debugger
        let width = element.offsetWidth;
        obj.widthsArr.forEach((wi, i) => {
            if (width < wi) return;
            size = Substrap.sizes[i];
        });

        const clas = 'substrap-' + size;

        const list = element.classList.toString();
        const match = list.match(/substrap-\S{2}/g);
        const len = (match || []).length;

        // if the current class is the wrong one then let's clean it
        let wrong = false;
        if (match && match.length) wrong = (match[0] !== clas);

        // if there are multiple substrap sizes then let's clean all
        const mult = len > 1;

        if (wrong || mult) {
            Substrap.clean(element);
        }

        // if there is no substrap size on this element then let's add the current
        if (len < 1) {
            element.classList.add(clas);
            try {
                if (obj.component)
                    return obj.component.forceUpdate();
            } catch (err) { console.warn(err) }
        }
    }

    /**
     * 
     * @param {DOM Element} element element to clean all substrap sizes off of
     */
    static clean(element) {
        Substrap.sizes.forEach((si) => {
            element.classList.remove('substrap-' + si);
        });
    }

    /**
     * sets up a new watch timer for the following element 
     * @param {String} elementId this is the element itself or the id for the element which will fetch the element by id
     * @param {Array} widthsArr is the sizes for sm, md, lg, xl; xs is size by default
     * @param {Component} component if you want your reactjs component to for rerender when the substrap class is modified
     */
    watch(elementId, widthsArr = [576, 768, 992, 1200], component = null) {

        Substrap.instance.add({
            elementId: elementId,
            component: component,
            widthsArr: widthsArr
        });
    }

    add(obj) {
        let err;
        if (!obj.elementId) err = "element name required: " + obj.elementId;

        if (err) {
            console.error(err);
            return;
        }

        // todo: make sure duplicates don't get added
        this._watchObjects.push(obj);
    }

    remove(obj) {
        // todo: add some business here
    }

    /**
     * returns the substap class currently on the element
     */
    getSubFromEle(id) {
        try {
            const element = document.getElementById(id);
            if(!element) return null;
            const list = element.classList.value;
            if(!list) return null;
            const match = list.match(/substrap-\S{2}/g);
            if(!match || !match.length) return null;
            return match[0].replace('substrap-','');
        } catch (err) {
            console.warn(err);
            return null;
        }
    }
}

export default new Substrap();