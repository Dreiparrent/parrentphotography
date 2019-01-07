import { MobileModule } from './mobile.module';

describe('MobileModule', () => {
  let mobileModule: MobileModule;

  beforeEach(() => {
    mobileModule = new MobileModule();
  });

  it('should create an instance', () => {
    expect(mobileModule).toBeTruthy();
  });
});
