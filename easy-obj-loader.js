'use strict'

module.exports = function(source) {
    // Vertex Line match from the obj file content
    const vertexMatch = source.match(/v(\s+-?\d+\.?\d*){3}/g);

    // Extracting vertices values from  each vertex matck
    const rvertices = [];
    vertexMatch.forEach(vertex => {
        let avertex = vertex.match(/-?\d+\.?\d*/g);
        rvertices.push(avertex);
    });

    // Texture Coordinates match
    const textureCordinateMatch = source.match(/vt(\s+\-?\d+\.?\d*){2}/g);
    
    const rTextCords = [];
    if (textureCordinateMatch) {
        textureCordinateMatch.forEach(texCordMatch => {
            let atextCord = texCordMatch.match(/\-?\d+\.?\d*/g);
            rTextCords.push(atextCord);
        });
    }

    // Normals Match
    const normalsMatch = source.match(/vn(\s+-?\d+\.?\d*){3}/g);
    const rnormals = [];
    normalsMatch.forEach(normal => {
        let anormal = normal.match(/-?\d+\.?\d*/g);
        rnormals.push(anormal);
    });

    // Faces match
    const facesMatch = source.match(/f(\s?\d+\/\d*\/\d+){3}/g);
    const rfaces = [];
    facesMatch.forEach(face => {
        const rIndex = face.match(/\d+\/\d*\/\d+/g);
        // console.log("RIndex Matches: ", rIndex);
        rIndex.forEach(index => {
            const rIndexSplit = index.match(/\d+/g);
            // console.log("rIndexSplit: ", index, rIndexSplit);
            rfaces.push(rIndexSplit);
        });
    });

    let vertices = [];
    let normals = [];
    let textCords = [];
    let indices = [];

    const indiceMap = new Map();

    const facesMatch2 = source.match(/f(\s?\d+\/\d*\/\d+){3}/g);

    let i = 0;
    facesMatch2.forEach(face => {
        const rIndex = face.match(/\d+\/\d*\/\d+/g);

        rIndex.forEach((iSet) => {
            let index = indiceMap.get(iSet);
            if (index === undefined) {
                let iDetail = iSet.split("/");
                
                vertices.push(rvertices[iDetail[0] - 1]);
                rTextCords[iDetail[1] - 1] && textCords.push(rTextCords[iDetail[1] - 1]);
                normals.push(rnormals[iDetail[2] - 1]);
                
                indiceMap.set(iSet, i);
                indices.push(i);
                i++;
            }
            else {
                indices.push(index);
            }
        });
    });

    indiceMap.clear();

    vertices = vertices.map((vertex) => vertex.map((e) => Number(e)));
    normals = normals.map((normal) => normal.map((e) => Number(e)));
    textCords = textCords?.map((textCord) => textCord?.map((e) => Number(e)));
    indices = indices.map((index) => Number(index));
    
    let output = `
        export default {
            vertices: ${JSON.stringify(vertices)},
            normals: ${JSON.stringify(normals)},
            indices: ${JSON.stringify(indices)},
            textCords: ${JSON.stringify(textCords)},
            raw: {
                rvertices: ${JSON.stringify(rvertices)},
                rtextCords: ${JSON.stringify(rTextCords)},
                rnormals: ${JSON.stringify(rnormals)},
                rfaces: ${JSON.stringify(rfaces)},
            }
        };`
    
   return output;
}