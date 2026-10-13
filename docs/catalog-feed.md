# Catalog feed maintenance

The publisher PAD feed is [docs/pad.xml](pad.xml). Its URL is stable; its contents are version-specific. Hosting is on the existing public GitHub repository, without a new subscription or scheduler.

Before updating the feed after a stable release:

1. Recheck the latest non-draft, non-prerelease release, in whichever repository published it: the signed 1.18.1 build the feed currently advertises lives in `AurelioAvila/pc-tweaker-app`, not here, and a URL pointing at the wrong repository is a 404 that no gate saw until `scripts/check-download-links.mjs` was added. Never substitute an older installer or relabel another version.
2. Verify the final artifact's SHA-256 against official release metadata, a valid Aurelio Avila Authenticode publisher signature and a trusted timestamp. Verify any updater-specific signature separately. Do not publish a download reference if these checks fail.
3. Update Program_Version, the release date, file sizes, change summary and Primary_Download_URL together. When the first signature-verified WinCraft release is published in this repository, the feed's URL moves to this repository's stable alias (`PCTweaker-Setup.exe`) at the same time. Keep the feed URL unchanged. Paid access, supported features and screenshot provenance must remain accurate.
4. Validate XML, description lengths, HTTPS URLs and the referenced icon/screenshot. Windows 10/11 x64 requirements are stated explicitly; WinOther is the legacy PAD 3.11 OS enumeration, not a Windows 7 compatibility claim.
5. Commit only verified publisher metadata. Download3K says it refreshes existing PAD feeds daily; acceptance and indexing remain editorial decisions. Do not create a duplicate application for every release.

This is self-hosted PAD 3.11 metadata with HTTPS support, not AppVisor certification. The feed does not regenerate automatically. Existing signing and release workflows are unchanged. Catalog submission, review and public publication are different states.
