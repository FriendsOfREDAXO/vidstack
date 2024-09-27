import * as _esbuild from 'esbuild';
import * as _rollup from 'rollup';
import * as _vite from 'vite';
import * as _unplugin from 'unplugin';

type FilterPattern = Array<string | RegExp> | string | RegExp | null;
interface UserOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
}
declare const unplugin: _unplugin.UnpluginInstance<UserOptions | undefined, boolean>;
declare const vite: (options?: UserOptions) => _vite.Plugin<any> | _vite.Plugin<any>[];
declare const rollup: (options?: UserOptions) => _rollup.Plugin<any> | _rollup.Plugin<any>[];
declare const webpack: (options?: UserOptions) => WebpackPluginInstance;
declare const rspack: (options?: UserOptions) => RspackPluginInstance;
declare const esbuild: (options?: UserOptions) => _esbuild.Plugin;

export { type FilterPattern, type UserOptions, esbuild, rollup, rspack, unplugin, vite, webpack };
