# Semantic Versioning Specification (SemVer):

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, 
“RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

1. Software using Semantic Versioning MUST declare a public API. This API could be declared in the code 
itself or exist strictly in documentation. However it is done, it should be precise and comprehensive.

2. A normal version number MUST take the form X.Y.Z where X, Y, and Z are integers. X is the major version, 
Y is the minor version, and Z is the patch version. Each element MUST increase numerically by increments of one. 
For instance: 1.9.0 -> 1.10.0 -> 1.11.0.

3. When a major version number is incremented, the minor version and patch version MUST be reset to zero. When a 
minor version number is incremented, the patch version MUST be reset to zero. For instance: 1.1.3 -> 2.0.0 and 
2.1.7 -> 2.2.0.

4. A pre-release version number MAY be denoted by appending an arbitrary string immediately following the patch 
version and a decimal point. The string MUST be comprised of only alphanumerics plus dash [0-9A-Za-z-] and MUST 
begin with an alpha character [A-Za-z]. Pre-release versions satisfy but have a lower precedence than the associated 
normal version. Precedence SHOULD be determined by lexicographic ASCII sort order. For instance: 1.0.0.alpha1 
< 1.0.0.beta1 < 1.0.0.beta2 < 1.0.0.rc1 < 1.0.0.

5. Once a versioned package has been released, the contents of that version MUST NOT be modified. Any modifications 
must be released as a new version.

6. Major version zero (0.y.z) is for initial development. Anything may change at any time. The public API should not 
be considered stable.

7. Version 1.0.0 defines the public API. The way in which the version number is incremented after this release is dependent 
on this public API and how it changes.

8. Patch version Z (x.y.Z | x > 0) MUST be incremented if only backwards compatible bug fixes are introduced. A bug fix is 
defined as an internal change that fixes incorrect behavior.

9. Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backwards compatible functionality is introduced to the public 
API. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY 
include patch level changes.

10. Major version X (X.y.z | X > 0) MUST be incremented if any backwards incompatible changes are introduced to the public API. 
It MAY include minor and patch level changes.
