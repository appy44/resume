# Feature Flag Provider Refactoring

## Step 1 - Create FeatureFlagProvider.java

```java
package com.principal.ris.featureflags.provider;

import com.principal.ris.featureflags.internal.impl.FlagCache;
import java.util.Collection;

public interface FeatureFlagProvider {

    void refreshCache(
            FlagCache cache,
            Collection<String> names);

}
```

## Step 2 - Create ProviderFactory.java

```java
package com.principal.ris.featureflags.provider;

public final class ProviderFactory {
    // factory implementation
}
```

## Step 3 - Create ApiFeatureFlagProvider.java

```java
package com.principal.ris.featureflags.internal.impl;

public class ApiFeatureFlagProvider
        implements FeatureFlagProvider {

    // move API refresh logic here
}
```

## Step 4 - Create CdnFeatureFlagProvider.java

```java
package com.principal.ris.featureflags.internal.impl;

public class CdnFeatureFlagProvider
        implements FeatureFlagProvider {

    // move CDN refresh logic here
}
```

## Step 5 - FeatureFlagClient Changes

Remove:

```java
private FeatureFlagApiClient apiClient;
private CdnFeatureFlagClient cdnClient;
```

Add:

```java
private final FeatureFlagProvider provider;
```

## Step 6 - Constructor Changes

```java
this.provider =
        ProviderFactory.create(
                config,
                retryPolicy,
                circuitBreaker);
```

## Step 7 - Startup Refresh

```java
safeRefreshAll("startup", null);
```

## Step 8 - Polling

```java
provider.refreshCache(cache, null);
```

## Step 9 - Cleanup

Delete after usages become zero:

```java
refreshFromCdn()
safeRefreshFromCDN()
refreshAll()
fetchFromApi()
```
