interface MeshData {
  vertices: number[][];
  normals: number[][];
  indices: number[];
  textCords: number[][];

  raw: {
    rvertices: number[][];
    rtextCords: number[][];
    rnormals: number[][];
    rfaces: number[][];
  }
}

declare module "*.obj" {
    const value: MeshData;
    export default value;
  }