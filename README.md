# AETHER Deep Space AI Academy

Static site for GitHub Pages. No build step is needed.

## Publish on GitHub Pages

1. Create a GitHub repository and upload `index.html`, `style.css`, `app.js`, `space.js`, and the entire `assets` folder to its root.
2. In the repository, open **Settings → Pages** and select **Deploy from a branch**, your main branch, and **/(root)**. GitHub will give you a Pages URL after deployment.
3. If you prefer a `docs` folder, put all site files, `assets`, and the `games` folder together in `docs`, then select `/docs` in Pages settings.

## Add the Unity WebGL levels

Export each Unity level as WebGL. Place the entire exported build (including its index.html, Build and TemplateData folders) in the corresponding folder:

- `games/level-1/`
- `games/level-2/`
- `games/level-3/`

The site loads each build in an iframe at `games/level-N/index.html` on the same GitHub Pages origin. Keep asset paths in Unity's generated index relative. GitHub Pages file names are case sensitive. If Unity export files exceed GitHub's upload limits, use Git LFS or another game host; normal GitHub Pages limits still apply.

### Report a completed level

When the player actually wins a Unity level, have the Unity WebGL page send this message to the parent page (where `level` is 1, 2, or 3):

```js
window.parent.postMessage(
  { type: 'AETHER_LEVEL_COMPLETE', level: 1 },
  window.location.origin
);
```

For example, include this in the Unity WebGL template and call it from Unity through a `.jslib` plugin when the victory condition fires:

```js
mergeInto(LibraryManager.library, {
  AetherComplete: function(level) {
    window.parent.postMessage(
      { type: 'AETHER_LEVEL_COMPLETE', level: level },
      window.location.origin
    );
  }
});
```

Save that file as `Assets/Plugins/WebGL/AetherBridge.jslib`. Call it from a Unity C# script at actual level completion:

```csharp
using System.Runtime.InteropServices;
using UnityEngine;

public class AetherWebGLBridge : MonoBehaviour
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void AetherComplete(int level);
#endif

    public void CompleteLevel(int level)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        AetherComplete(level);
#endif
    }
}
```

Attach the component to a GameObject and call `CompleteLevel(1)` after Level 1's real win condition, `CompleteLevel(2)` for Level 2, etc. The website checks that the event comes from the currently open, same-origin game iframe and that the previous mission is complete.

## Progress

XP and completions are stored in the student's browser using localStorage. Progress does not sync between devices and can be cleared or altered locally. This is a classroom prototype, not a secure assessment or account system.

## Background and achievement

The supplied Lunatic Superstar font is bundled in `assets`. The blue palette uses #071040, #060B26, #0D2673, #1438A6, and #2552D9. A generated deep space background and purple moon are bundled as WebP assets. Stars animate with `space.js`; reduced-motion preferences pause the animation. The Moonrise achievement and purple moon appear only when the Level 1 WebGL game reports completion and persist on that device.

## ORACLE camera

`assets/oracle-camera.webp` replaces the original ORACLE orb. `oracle-eye.js` moves its blue pupil toward the visitor's pointer and respects reduced motion. Keep the camera image, `oracle-eye.js`, and the new markup in `index.html` together when uploading to GitHub Pages.
