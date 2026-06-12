# Feature Flags SDK - CDN Mode Implementation

## Consumer Configuration

```properties
feature.flags.mode=CDN
feature.flags.cdn-url=https://flags.company.com
feature.flags.app-name=on-prem-app-4
feature.flags.environment=dev
```

## CdnFeatureFlagClient

```java
package com.principal.ris.featureflags.internal;

import com.principal.ris.featureflags.FeatureFlagClientConfig;
import java.util.Map;

public class CdnFeatureFlagClient {

    private final FeatureFlagClientConfig config;

    public CdnFeatureFlagClient(FeatureFlagClientConfig config) {
        this.config = config;
    }

    public String fetchVersion() {
        String url = config.getCdnBaseUrl()
                + "/" + config.getAppName()
                + "/" + config.getEnvironment()
                + "/version.json";

        HttpSupport.Response response =
                HttpSupport.get(url, Map.of(),
                        config.getTimeoutMillis());

        return SimpleJson.parseObject(response.getBody())
                .get("version")
                .toString();
    }

    public Map<String, Object> fetchFlags() {
        String url = config.getCdnBaseUrl()
                + "/" + config.getAppName()
                + "/" + config.getEnvironment()
                + "/flags.json";

        HttpSupport.Response response =
                HttpSupport.get(url, Map.of(),
                        config.getTimeoutMillis());

        return SimpleJson.parseObject(response.getBody());
    }
}
```

## Steps

1. Create FeatureFlagMode enum.
2. Update FeatureFlagClientConfig.
3. Update FlagCache with version support.
4. Create CdnFeatureFlagClient.
5. Add cdnClient field.
6. Add refreshFromCdn().
7. Add safeRefreshFromCdn().
8. Update startup flow.
9. Update polling flow.

## Runtime Flow

version.json -> compare local version -> if changed fetch flags.json -> update cache.
