import {CoreContext} from "cad/context";
import {ReadSketch} from "./sketchReader";
import {ContextSpec} from "bundler/bundleSystem";

export function activate(ctx: CoreContext) {

  function getAllSketches() {
    let nm = ctx.projectService.sketchStorageNamespace;
    return ctx.storageService.getAllKeysFromNamespace(nm).map(fqn => ({
      fqn, id: fqn.substring(nm.length)
    }));
  }

  function getSketchData(sketchId) {
    let sketchStorageKey = ctx.projectService.sketchStorageKey(sketchId);
    return ctx.storageService.get(sketchStorageKey);
  }

  function setSketchData(sketchId, data) {
    let sketchStorageKey = ctx.projectService.sketchStorageKey(sketchId);
    return ctx.storageService.set(sketchStorageKey, data);
  }

  function removeSketchData(sketchId) {
    let sketchStorageKey = ctx.projectService.sketchStorageKey(sketchId);
    return ctx.storageService.remove(sketchStorageKey);
  }

  function hasSketch(sketchId) {
    let sketchStorageKey = ctx.projectService.sketchStorageKey(sketchId);
    return !!ctx.storageService.get(sketchStorageKey);
  }

  function readSketch(sketchId) {
    let savedSketch = getSketchData(sketchId);
    if (savedSketch === null) {
      return null;
    }

    try {
      return ReadSketch(JSON.parse(savedSketch), sketchId, true);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  ctx.sketchStorageService = {
    getAllSketches, readSketch, hasSketch, getSketchData, setSketchData, removeSketchData
  }
}

export interface SketchStorageService {

  getAllSketches(): {
    id: string,
    fqn: string
  }[];

  getSketchData(sketchId: string): string;

  setSketchData(sketchId: string, data: string): void;

  removeSketchData(sketchId: string): void;

  hasSketch(sketchId: string): boolean;

  readSketch(sketchId: string): any;

}

export interface SketchStorageBundleContext {

  sketchStorageService: SketchStorageService;
}

export const outputContextSpec: ContextSpec<SketchStorageBundleContext> = {
  sketchStorageService: 'required'
}

